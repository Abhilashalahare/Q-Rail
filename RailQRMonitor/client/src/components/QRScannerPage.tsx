import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Upload, Search } from "lucide-react"
import FittingCard, { type Fitting } from "./FittingCard"
import { useToast } from "@/hooks/use-toast"

// Extended Fitting interface to include vendor part data
interface ExtendedFitting extends Fitting {
  materialComposition?: string
}

// TODO: remove mock data - replace with real API calls
const mockFittings: Fitting[] = [
  {
    id: "1",
    qrCode: "RC-2024-001",
    type: "Elastic Rail Clip",
    vendor: "RailTech Industries",
    lotNumber: "RT-2024-A47",
    supplyDate: "2024-01-15",
    warrantyExpiry: "2027-01-15",
    lastInspection: "2024-11-01",
    status: "ok",
    location: "Track Section 12-A"
  },
  {
    id: "2", 
    qrCode: "LP-2024-002",
    type: "Liner Pad",
    vendor: "TrackSecure Ltd",
    lotNumber: "TS-2024-B23",
    supplyDate: "2024-02-20",
    warrantyExpiry: "2026-02-20",
    lastInspection: "2024-10-15",
    status: "warning",
    location: "Junction Point 7-B"
  },
  {
    id: "3",
    qrCode: "SL-2023-003", 
    type: "Concrete Sleeper",
    vendor: "Railway Components Co",
    lotNumber: "RC-2023-C89",
    supplyDate: "2023-11-10",
    warrantyExpiry: "2028-11-10",
    lastInspection: "2024-09-20",
    status: "defective",
    location: "Bridge Section 3-C"
  }
]

export function QRScannerPage() {
  const [qrInput, setQrInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [scannedFitting, setScannedFitting] = useState<ExtendedFitting | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleManualScan = () => {
    if (!qrInput.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a QR code to scan.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      // First try to find in mock fittings
      let fitting = mockFittings.find(f => f.qrCode === qrInput.trim())
      
      // If not found in mock data, check vendor parts
      if (!fitting) {
        try {
          const PARTS_STORAGE_KEY = 'railway_qr_parts'
          const stored = localStorage.getItem(PARTS_STORAGE_KEY)
          const vendorParts = stored ? JSON.parse(stored) : []
          
          const vendorPart = vendorParts.find((part: any) => 
            part.qrCode === qrInput.trim() || 
            part.id === qrInput.trim() ||
            part.qrCode.includes(qrInput.trim()) ||
            qrInput.trim().includes(part.lotNumber)
          )
          
          if (vendorPart) {
            // Convert vendor part to fitting format
            const expiry = new Date(vendorPart.expiryDate)
            const now = new Date()
            const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            
            let status: "ok" | "warning" | "defective" = "ok"
            if (daysUntilExpiry < 0) status = "defective"
            else if (daysUntilExpiry < 90) status = "warning"
            
            fitting = {
              id: vendorPart.id,
              qrCode: vendorPart.qrCode,
              type: vendorPart.partType,
              vendor: vendorPart.vendorName,
              lotNumber: vendorPart.lotNumber,
              supplyDate: vendorPart.manufactureDate,
              warrantyExpiry: vendorPart.expiryDate,
              lastInspection: new Date().toISOString().split('T')[0], // Today for demo
              status: status,
              location: `Manufacturing: ${vendorPart.manufacturingLocation}`,
              materialComposition: vendorPart.materialComposition
            } as ExtendedFitting
          }
        } catch (error) {
          console.log('Error checking vendor parts:', error)
        }
      }
      
      if (fitting) {
        setScannedFitting(fitting)
        toast({
          title: "QR Code Scanned",
          description: `Found ${fitting.type} from ${fitting.vendor}`
        })
      } else {
        toast({
          title: "QR Code Not Found", 
          description: "No fitting found with this QR code.",
          variant: "destructive"
        })
        setScannedFitting(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // TODO: replace with real image processing
      toast({
        title: "Image Uploaded",
        description: "Processing QR code from image..."
      })
      
      setIsLoading(true)
      setTimeout(() => {
        // Simulate finding a QR code in the image
        const randomFitting = mockFittings[Math.floor(Math.random() * mockFittings.length)]
        setScannedFitting(randomFitting)
        setQrInput(randomFitting.qrCode)
        toast({
          title: "QR Code Detected",
          description: `Extracted QR code: ${randomFitting.qrCode}`
        })
        setIsLoading(false)
      }, 2000)
    }
  }

  const clearScan = () => {
    setScannedFitting(null)
    setQrInput("")
    setSelectedFile(null)
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-qr-scanner">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Scan or upload QR codes to view track fitting details and inspection history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanning Options */}
        <div className="space-y-6">
          {/* Manual Entry */}
          <Card data-testid="card-manual-entry">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Manual QR Entry
              </CardTitle>
              <CardDescription>
                Enter the QR code manually to retrieve fitting information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-input">QR Code</Label>
                <Input
                  id="qr-input"
                  placeholder="e.g., RC-2024-001"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  data-testid="input-qr-code"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Try: RC-2024-001, LP-2024-002, SL-2023-003, or any vendor QR code
                </p>
              </div>
              <Button 
                onClick={handleManualScan} 
                disabled={isLoading}
                className="w-full"
                data-testid="button-manual-scan"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Scanning..." : "Scan QR Code"}
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card data-testid="card-file-upload">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload QR Image
              </CardTitle>
              <CardDescription>
                Upload an image containing a QR code for automatic detection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-upload">QR Code Image</Label>
                <Input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  data-testid="input-file-upload"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center text-muted-foreground">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Drag & drop QR code images here</p>
                <p className="text-xs">Supports JPG, PNG, WEBP formats</p>
              </div>
            </CardContent>
          </Card>

          {scannedFitting && (
            <Button 
              onClick={clearScan} 
              variant="outline" 
              className="w-full"
              data-testid="button-clear-scan"
            >
              Clear Scan Results
            </Button>
          )}
        </div>

        {/* Results */}
        <div>
          {scannedFitting ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fitting Details</h3>
              <FittingCard fitting={scannedFitting} />
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center" data-testid="card-no-results">
              <CardContent className="text-center py-12">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No QR Code Scanned</h3>
                <p className="text-muted-foreground">
                  Enter a QR code manually or upload an image to view fitting details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRScannerPage