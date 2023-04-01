import { Crud } from "./base";

const { defaultGet } = new Crud('https://my-json-server.typicode.com/tractian/fake-api')

type DBObject = {
  name: string
  id: number
}

export type HealthStatus = {
  status: "inOperation" | "inDowntime" | "inAlert" | "plannedStop" | "unplannedStop",
  timestamp: string
}

type Metric = {
  lastUptimeAt: string,
  totalCollectsUptime: number,
  totalUptime: number
}

export type Asset = DBObject & {
  assignedUserIds: number[],
  companyId: number,
  healthHistory: HealthStatus[],
  healthscore: number,
  image: string,
  metrics: Metric,
  model: string,
  sensors: string[]
  specifications: {
    maxTemp: number,
    power?: number,
    rpm?: number
  },
  status: HealthStatus['status'],
  unitId: number
}

export const GetAssets = () => defaultGet<Asset[]>('/assets')

export type User = DBObject & {
  companyId: number,
  unitId: number
  email: string,
}

export const GetUsers = () => defaultGet<User[]>('/users');

export type Unit = DBObject & {
  companyId: number,
}

export const GetUnits = () => defaultGet<Unit[]>('/units');

export type Company = DBObject

export const GetCompanies = () => defaultGet<Company[]>('/companies')