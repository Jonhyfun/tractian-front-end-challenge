import { HealthStatus } from "@/api/fakeapi"

export const AssetNameToLabel: { [key in HealthStatus['status']]: string } = {
  unplannedStop: "⚠️ Unplanned Stop",
  inDowntime: "🔴 Down",
  inAlert: "🟠 Alert",
  inOperation: "🟢 Operating",
  plannedStop: "🔧 Planned Stop",
}

export const AssetStatusMap: { [key in HealthStatus['status']]: JSX.Element } = {
  inOperation: <span className="text-[green] drop-shadow-sm">{AssetNameToLabel['inOperation']}</span>,
  inAlert: <span className="text-orange-500 drop-shadow-sm">{AssetNameToLabel['inAlert']}</span>,
  inDowntime: <span className="text-red-500 drop-shadow-sm">{AssetNameToLabel['inDowntime']}</span>,
  plannedStop: <span className="text-blue-500 drop-shadow-sm">{AssetNameToLabel['plannedStop']}</span>,
  unplannedStop: <span className="text-yellow-500 drop-shadow-sm">{AssetNameToLabel['unplannedStop']}</span>,
}

export function getHealthColor(percentage: number) {
  if (percentage < 50) return 'red'
  else if (percentage >= 70) return 'green'
  else if (percentage > 50) return '#f97316'
}

export const AssetGraphMap: { [key in HealthStatus['status']]: number } = {
  plannedStop: 4,
  inOperation: 3,
  inAlert: 2,
  inDowntime: 1,
  unplannedStop: 0,
}

