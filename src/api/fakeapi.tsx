import { Crud } from "./base";

const { defaultGet } = new Crud('https://my-json-server.typicode.com/tractian/fake-api')


export type HealthStatus = {
  status: "inOperation" | "inDowntime" | "inAlert" | "unplannedStop",
  timestamp: string
}

type Metric = {
  lastUptimeAt: string,
  totalCollectsUptime: number,
  totalUptime: number
}

export type Asset = {
  assignedUserIds: number[],
  companyId: number,
  healthHistory: HealthStatus[],
  healthscore: number, //todo green to red
  id: number,
  image: string,
  metrics: Metric,
  model: string,
  name: string,
  sensors: string[]
  specifications: {
    maxTemp: number,
    power?: number,
    rpm?: number
  },
  status: HealthStatus['status'],
  unitId: number
}

export const GetAssets = (assetId?: string) => defaultGet<Asset[]>(assetId ? `/assets/${assetId}` : '/assets')