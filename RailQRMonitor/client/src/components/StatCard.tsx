import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
  const trendColors = {
    up: 'text-chart-1',
    down: 'text-chart-5', 
    neutral: 'text-muted-foreground'
  }

  return (
    <Card className="hover-elevate" data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {description && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            {description}
            {trend && trendValue && (
              <span className={trendColors[trend]}>
                {trend === 'up' && '↗'} {trend === 'down' && '↘'} {trendValue}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard