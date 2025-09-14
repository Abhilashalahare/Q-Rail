import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { FileText, Download, Search, QrCode, Calendar, Package } from 'lucide-react'
import { type Part } from './VendorDashboard'
import QRCode from 'qrcode'
import { useToast } from '@/hooks/use-toast'

const PARTS_STORAGE_KEY = 'railway_qr_parts'

function getStoredParts(): Part[] {
  try {
    const stored = localStorage.getItem(PARTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function VendorRecords() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [parts, setParts] = useState<Part[]>([])
  const [filteredParts, setFilteredParts] = useState<Part[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load parts for current vendor
    const allParts = getStoredParts()
    const vendorParts = allParts.filter(part => part.vendorId === user?.id)
    setParts(vendorParts)
    setFilteredParts(vendorParts)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => {
    // Filter parts based on search term
    if (!searchTerm) {
      setFilteredParts(parts)
    } else {
      const filtered = parts.filter(part => 
        part.partType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.manufacturingLocation.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredParts(filtered)
    }
  }, [searchTerm, parts])

  const downloadQRCode = async (part: Part) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(part.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      const link = document.createElement('a')
      link.download = `QR-${part.lotNumber}.png`
      link.href = qrDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: 'QR Code Downloaded',
        description: `QR code for ${part.partType} (${part.lotNumber}) downloaded`
      })
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to generate QR code for download',
        variant: 'destructive'
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return 'bg-chart-5/10 text-chart-5 border-chart-5/20'
    if (daysUntilExpiry < 90) return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
    return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
  }

  const getStatusText = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return 'Expired'
    if (daysUntilExpiry < 90) return 'Expiring Soon'
    return 'Active'
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p>Loading your records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-vendor-records">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manufacturing Records</h1>
        <p className="text-muted-foreground">
          View and manage all parts you've created with their QR codes.
        </p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by part type, lot number, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" data-testid="text-total-records">{parts.length}</p>
            <p className="text-xs text-muted-foreground">Total Parts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" data-testid="text-filtered-records">{filteredParts.length}</p>
            <p className="text-xs text-muted-foreground">Showing</p>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      {filteredParts.length === 0 ? (
        <Card className="text-center py-12" data-testid="card-no-records">
          <CardContent>
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {parts.length === 0 ? 'No Parts Created Yet' : 'No Parts Found'}
            </h3>
            <p className="text-muted-foreground">
              {parts.length === 0 
                ? 'Create your first part to see records here.'
                : 'Try adjusting your search terms.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((part) => (
            <Card key={part.id} className="hover-elevate" data-testid={`card-part-${part.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{part.partType}</CardTitle>
                    <p className="text-sm text-muted-foreground">Lot: {part.lotNumber}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(part.expiryDate)}>
                    {getStatusText(part.expiryDate)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{part.manufacturingLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Manufactured</p>
                      <p className="text-muted-foreground">{formatDate(part.manufactureDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Expires</p>
                      <p className="text-muted-foreground">{formatDate(part.expiryDate)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Material Composition:</p>
                  <p className="text-xs bg-muted p-2 rounded">{part.materialComposition}</p>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">QR Code Data:</p>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">{part.qrCode}</p>
                </div>
                
                <Button 
                  onClick={() => downloadQRCode(part)} 
                  variant="outline" 
                  className="w-full"
                  data-testid={`button-download-${part.id}`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorRecords