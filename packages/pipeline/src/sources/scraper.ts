import * as cheerio from 'cheerio';
import type { Region, RawEvent } from '@nightpulse/shared';
import { BaseSource } from './base-source.js';
import { createLogger } from '../utils/logger.js';
import { withRetry } from '../utils/retry.js';

const logger = createLogger('scraper');

/** CSS selector configuration for extracting event data from a page */
export interface SelectorConfig {
  readonly eventContainer: string;
  readonly title: string;
  readonly date: string;
  readonly venue: string;
  readonly link: string;
  readonly description?: string;
  readonly price?: string;
  readonly image?: string;
}

/** User-Agent strings rotated across requests */
const USER_AGENTS: readonly string[] = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
];

/**
 * Scrapes events from a configurable URL using CSS selectors.
 * Supports User-Agent rotation to reduce blocking risk.
 */
export class ScraperSource extends BaseSource {
  readonly name = 'scraper' as const;
  readonly cronSchedule = '0 */6 * * *';

  private readonly targetUrl: string;
  private readonly selectors: SelectorConfig;
  private requestIndex = 0;

  constructor(targetUrl: string, selectors: SelectorConfig) {
    super();

    if (!targetUrl) {
      throw new Error('Target URL is required for ScraperSource');
    }

    this.targetUrl = targetUrl;
    this.selectors = selectors;
  }

  async fetchEvents(region: Region): Promise<readonly RawEvent[]> {
    logger.info({ url: this.targetUrl, region: region.name }, 'Scraping events');

    try {
      const html = await this.fetchHtml();
      const events = this.parseEvents(html, region);

      logger.info({ count: events.length, region: region.name }, 'Scraped events');
      return events;
    } catch (error: unknown) {
      logger.error({ error, url: this.targetUrl, region: region.name }, 'Failed to scrape events');
      throw error;
    }
  }

  private async fetchHtml(): Promise<string> {
    return withRetry(
      async () => {
        const userAgent = this.getNextUserAgent();
        const response = await fetch(this.targetUrl, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        });

        if (!response.ok) {
          throw new Error(`Scraper HTTP error: ${response.status} ${response.statusText}`);
        }

        return response.text();
      },
      { maxAttempts: 3, baseDelayMs: 3000 },
    );
  }

  private parseEvents(html: string, region: Region): readonly RawEvent[] {
    const $ = cheerio.load(html);
    const events: RawEvent[] = [];

    $(this.selectors.eventContainer).each((_index, element) => {
      try {
        const $el = $(element);

        const title = $el.find(this.selectors.title).text().trim();
        if (!title) {
          return; // skip entries without a title
        }

        const rawDate = $el.find(this.selectors.date).text().trim();
        const venueName = $el.find(this.selectors.venue).text().trim();
        const link = $el.find(this.selectors.link).attr('href') ?? '';

        const description = this.selectors.description
          ? $el.find(this.selectors.description).text().trim()
          : undefined;

        const price = this.selectors.price
          ? $el.find(this.selectors.price).text().trim() || undefined
          : undefined;

        const imageUrl = this.selectors.image
          ? $el.find(this.selectors.image).attr('src') ?? undefined
          : undefined;

        // Generate a stable source ID from the link or title
        const sourceId = link || title.toLowerCase().replace(/\s+/g, '-');

        const event: RawEvent = {
          sourceId,
          source: 'scraper',
          title,
          description,
          startDate: rawDate || undefined,
          url: link || undefined,
          imageUrl,
          venueName: venueName || undefined,
          city: region.name,
          lat: region.centerLat,
          lng: region.centerLng,
          price,
        };

        events.push(event);
      } catch (error: unknown) {
        logger.warn({ error, index: _index }, 'Failed to parse individual event element');
      }
    });

    return events;
  }

  private getNextUserAgent(): string {
    const agent = USER_AGENTS[this.requestIndex % USER_AGENTS.length]!;
    this.requestIndex++;
    return agent;
  }
}
