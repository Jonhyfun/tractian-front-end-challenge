import { Asset } from "@/api/fakeapi";
import type { HealthStatus } from "@/api/fakeapi";
import { AssetGraphMap } from "./display";

export function SortByHealth(assets: Asset[]): Asset[] {
  const healthTypes: { [key in HealthStatus['status']]: Array<Asset> } = {
    unplannedStop: [],
    plannedStop: [],
    inAlert: [],
    inDowntime: [],
    inOperation: [],
  }

  assets.forEach((asset) => {
    healthTypes[asset.status].push(asset);
  })

  return [...healthTypes.unplannedStop, ...healthTypes.inDowntime, ...healthTypes.inAlert, ...healthTypes.inOperation];
}

export function AssetsOrganizer(assets: Asset[]) {
  console.log({ assets })

  let dates: string[] = [];
  let series: Highcharts.SeriesOptionsType[] = [];
  let assetsNames: string[] = [];

  assets.forEach(({ healthHistory, name }) => {
    let data: { y: number }[] = [];

    if (!assetsNames.includes(name)) {
      assetsNames.push(name);
    }

    healthHistory.forEach(({ timestamp, status }) => {
      data.push({ y: AssetGraphMap[status] })

      if (!dates.includes(timestamp)) {
        dates.push(timestamp);
      }
    })

    series.push({
      type: 'line',
      name,
      data,
    })
  })

  console.log({ dates })

  return {
    dates: dates.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    }),
    series,
    assetsNames
  }
}