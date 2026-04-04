import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { DbEvent } from '@nightpulse/shared';

export interface MapBounds {
  readonly north: number;
  readonly south: number;
  readonly east: number;
  readonly west: number;
}

export interface ClusterProperties {
  readonly cluster: true;
  readonly cluster_id: number;
  readonly point_count: number;
  readonly point_count_abbreviated: number | string;
}

export interface PointProperties {
  readonly cluster: false;
  readonly event: DbEvent;
}

export type ClusterFeature = Supercluster.ClusterFeature<ClusterProperties>;
export type PointFeature = Supercluster.PointFeature<PointProperties>;
export type ClusterOrPoint = ClusterFeature | PointFeature;

export function isCluster(feature: ClusterOrPoint): feature is ClusterFeature {
  return 'cluster' in feature.properties && feature.properties.cluster === true;
}

interface UseClusterOptions {
  readonly events: readonly DbEvent[];
  readonly zoom: number;
  readonly bounds: MapBounds | null;
}

interface UseClusterResult {
  readonly clusters: readonly ClusterOrPoint[];
  readonly getExpansionZoom: (clusterId: number) => number;
}

function eventToFeature(event: DbEvent): Supercluster.PointFeature<PointProperties> {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [event.lng, event.lat],
    },
    properties: {
      cluster: false as const,
      event,
    },
  };
}

export function useCluster({ events, zoom, bounds }: UseClusterOptions): UseClusterResult {
  const index = useMemo(() => {
    const sc = new Supercluster<PointProperties, ClusterProperties>({
      radius: 60,
      maxZoom: 18,
    });
    const features = events.map(eventToFeature);
    sc.load(features);
    return sc;
  }, [events]);

  const clusters = useMemo(() => {
    if (!bounds) {
      return [];
    }
    return index.getClusters(
      [bounds.west, bounds.south, bounds.east, bounds.north],
      Math.floor(zoom),
    );
  }, [index, bounds, zoom]);

  const getExpansionZoom = useMemo(
    () => (clusterId: number) => {
      try {
        return index.getClusterExpansionZoom(clusterId);
      } catch {
        return Math.floor(zoom) + 2;
      }
    },
    [index, zoom],
  );

  return { clusters, getExpansionZoom };
}
