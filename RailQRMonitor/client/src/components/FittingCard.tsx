import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "./StatusBadge"
import { Calendar, Package, User, MapPin } from "lucide-react"

export interface Fitting {
  id: string
  qrCode: string
  type: string
  vendor: string
  lotNumber: string
  supplyDate: string
  warrantyExpiry: string
  lastInspection: string
  status: 'ok' | 'warning' | 'defective'
  location: string
}

interface FittingCardProps {
  fitting: Fitting
  className?: string
}

export function FittingCard({ fitting, className = '' }: FittingCardProps) {
  return (
    <Card className={`hover-elevate ${className}`} data-testid={`card-fitting-${fitting.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{fitting.type}</CardTitle>
            <p className="text-sm text-muted-foreground">QR: {fitting.qrCode}</p>
          </div>
          <StatusBadge status={fitting.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Vendor</p>
              <p className="text-muted-foreground">{fitting.vendor}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Lot #</p>
              <p className="text-muted-foreground">{fitting.lotNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Last Inspection</p>
              <p className="text-muted-foreground">{fitting.lastInspection}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">{fitting.location}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Warranty expires: {fitting.warrantyExpiry}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default FittingCard