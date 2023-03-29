import { Asset } from "@/api/fakeapi";
import type { HealthStatus } from "@/api/fakeapi";

export function SortByHealth(assets: Asset[]): Asset[] {
  const healthTypes: { [key in HealthStatus['status']]: Array<Asset> } = {
    unplannedStop: [],
    inAlert: [],
    inDowntime: [],
    inOperation: [],
  }

  assets.forEach((asset) => {
    healthTypes[asset.status].push(asset);
  })

  return [...healthTypes.unplannedStop, ...healthTypes.inDowntime, ...healthTypes.inAlert, ...healthTypes.inOperation];
}