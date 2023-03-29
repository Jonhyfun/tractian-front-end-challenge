import { HealthStatus } from "@/api/fakeapi"

export const AssetStatusMap: { [key in HealthStatus['status']]: JSX.Element } = {
  inOperation: <span className="text-[green] drop-shadow-sm">🟢 Operating</span>,
  inAlert: <span className="text-orange-500 drop-shadow-sm">🟠 Alert</span>,
  inDowntime: <span className="text-red-500 drop-shadow-sm">🔴 Down</span>,
  unplannedStop: <span className="text-yellow-500 drop-shadow-sm">⚠️ Unplanned Stop</span>,
}

export function getHealthColor(percentage: number) {
  if (percentage < 50) return 'red'
  else if (percentage >= 70) return 'green'
  else if (percentage > 50) return '#f97316'
}

