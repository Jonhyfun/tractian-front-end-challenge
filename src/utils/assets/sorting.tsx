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
  const result = {
    dates: [] as string[],
    assetNames: [] as string[],
    healthSeries: [] as Highcharts.SeriesOptionsType[],
    totalUptimeSeries: [] as Highcharts.SeriesOptionsType[],
    totalHealthPercents: [] as Highcharts.SeriesOptionsType[],
  }

  const { assetNames, dates, healthSeries, totalUptimeSeries, totalHealthPercents } = result;

  assets.forEach(({ healthHistory, name, healthscore, metrics }) => {
    let data: { y: number }[] = [];

    if (!assetNames.includes(name)) {
      assetNames.push(name);
    }

    healthHistory.forEach(({ timestamp, status }) => {
      data.push({ y: AssetGraphMap[status] })

      if (!dates.includes(timestamp)) {
        dates.push(timestamp);
      }
    })

    healthSeries.push({
      type: 'line',
      name,
      data,
    })

    totalUptimeSeries.push({
      type: 'column',
      name,
      data: [
        [name, (Number(metrics.totalUptime.toFixed(2)))]
      ],
    })

    totalHealthPercents.push({
      type: 'column',
      name,
      data: [
        [name, healthscore]
      ],
    })
  })

  return {
    ...result,
    dates: dates.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    }),
  }
}