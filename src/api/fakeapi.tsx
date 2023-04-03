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
export const GetAsset = (assetId: string) => defaultGet<Asset>(`/assets/${assetId}`)

export type User = DBObject & {
  companyId: number,
  unitId: number
  email: string,
}

export type UserWithReferences = User & {
  unit: Unit
  company: Company
  assets: Asset[]
}

export const GetUsers = () => defaultGet<User[]>('/users');
export const GetUser = (userId: string) => defaultGet<User>(`/users/${userId}`);

export type Unit = DBObject & {
  companyId: number,
}

export const GetUnits = () => defaultGet<Unit[]>('/units');
export const GetUnit = (unitId: number) => defaultGet<Unit>(`/units/${unitId}`);

export type Company = DBObject

export const GetCompanies = () => defaultGet<Company[]>('/companies')
export const GetCompany = (companyId: number) => defaultGet<Company>(`/companies/${companyId}`)

export type WorkOrder = {
  assetId: number,
  assignedUserIds: number[],
  checklist: { completed: boolean, task: string }[],
  description: string,
  id: number,
  priority: string,
  status: string,
  title: string
}

export const GetWorkOrders = () => defaultGet<WorkOrder[]>('/workorders');