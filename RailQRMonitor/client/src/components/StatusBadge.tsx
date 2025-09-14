import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: 'ok' | 'warning' | 'defective'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = {
    ok: {
      label: 'OK',
      icon: CheckCircle,
      className: 'bg-chart-1/10 text-chart-1 border-chart-1/20 hover:bg-chart-1/20'
    },
    warning: {
      label: 'Needs Attention',
      icon: AlertCircle,
      className: 'bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20'
    },
    defective: {
      label: 'Defective',
      icon: XCircle,
      className: 'bg-chart-5/10 text-chart-5 border-chart-5/20 hover:bg-chart-5/20'
    }
  }

  const { label, icon: Icon, className: statusClass } = config[status]

  return (
    <Badge 
      variant="outline" 
      className={`${statusClass} ${className} gap-1`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

export default StatusBadge