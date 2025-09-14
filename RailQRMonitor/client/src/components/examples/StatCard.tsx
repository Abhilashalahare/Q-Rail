import StatCard from '../StatCard'
import { Package, CheckCircle } from 'lucide-react'

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        title="Total Fittings"
        value="1,877"
        icon={Package}
        description="Active track components"
        trend="up"
        trendValue="+2.1%"
      />
      <StatCard
        title="Operational"
        value="1,847"
        icon={CheckCircle}
        description="Fittings in good condition"
        trend="up"
        trendValue="+1.5%"
      />
    </div>
  )
}