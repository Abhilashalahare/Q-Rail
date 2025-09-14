import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Factory, Package, Download, QrCode, LogOut } from 'lucide-react'
import QRCode from 'qrcode'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// TODO: remove mock data - replace with real API calls
const partFormSchema = z.object({
  partType: z.string().min(1, 'Part type is required'),
  manufacturingLocation: z.string().min(1, 'Manufacturing location is required'),
  materialComposition: z.string().min(10, 'Material composition must be at least 10 characters'),
  lotNumber: z.string().optional(),
  manufactureDate: z.string().min(1, 'Manufacture date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
})

type PartForm = z.infer<typeof partFormSchema>

export interface Part {
  id: string
  qrCode: string
  partType: string
  manufacturingLocation: string
  materialComposition: string
  lotNumber: string
  manufactureDate: string
  expiryDate: string
  vendorId: string
  vendorName: string
  createdAt: string
}

const PARTS_STORAGE_KEY = 'railway_qr_parts'

function getStoredParts(): Part[] {
  try {
    const stored = localStorage.getItem(PARTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveParts(parts: Part[]) {
  localStorage.setItem(PARTS_STORAGE_KEY, JSON.stringify(parts))
}

export function VendorDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedQR, setGeneratedQR] = useState<{ qrCode: string; dataUrl: string } | null>(null)

  const form = useForm<PartForm>({
    resolver: zodResolver(partFormSchema),
    defaultValues: {
      partType: '',
      manufacturingLocation: '',
      materialComposition: '',
      lotNumber: '',
      manufactureDate: '',
      expiryDate: '',
    },
  })

  const generateLotNumber = () => {
    const prefix = form.getValues('partType').split(' ').map(word => word.charAt(0)).join('').toUpperCase()
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `${prefix || 'PT'}-${timestamp}-${random}`
  }

  const autoGenerateLot = () => {
    const lotNumber = generateLotNumber()
    form.setValue('lotNumber', lotNumber)
  }

  const generateQRCode = async (data: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  const onSubmit = async (data: PartForm) => {
    if (!user) return
    
    setIsSubmitting(true)
    
    try {
      // Generate lot number if not provided
      const lotNumber = data.lotNumber || generateLotNumber()
      
      // Create unique part ID and QR code
      const partId = `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const qrCodeData = `${partId}::${data.partType}::${lotNumber}::${user.name}`
      
      // Generate QR code image
      const qrDataUrl = await generateQRCode(qrCodeData)
      
      // Create part object
      const newPart: Part = {
        id: partId,
        qrCode: qrCodeData,
        partType: data.partType,
        manufacturingLocation: data.manufacturingLocation,
        materialComposition: data.materialComposition,
        lotNumber,
        manufactureDate: data.manufactureDate,
        expiryDate: data.expiryDate,
        vendorId: user.id,
        vendorName: user.name,
        createdAt: new Date().toISOString()
      }
      
      // Save to mock storage
      const existingParts = getStoredParts()
      existingParts.push(newPart)
      saveParts(existingParts)
      
      // Set generated QR for display
      setGeneratedQR({
        qrCode: qrCodeData,
        dataUrl: qrDataUrl
      })
      
      toast({
        title: 'Part Created Successfully',
        description: `QR Code generated for ${data.partType} with lot number ${lotNumber}`
      })
      
      // Reset form
      form.reset()
      
    } catch (error) {
      toast({
        title: 'Error Creating Part',
        description: 'Failed to generate QR code. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadQRCode = () => {
    if (!generatedQR) return
    
    const link = document.createElement('a')
    link.download = `QR-${generatedQR.qrCode.split('::')[2]}.png`
    link.href = generatedQR.dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'QR Code Downloaded',
      description: 'QR code image saved to your device'
    })
  }

  const clearGenerated = () => {
    setGeneratedQR(null)
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-vendor-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Factory className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} data-testid="button-logout">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manufacturing Form */}
        <Card data-testid="card-manufacturing-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Manufacturing Details
            </CardTitle>
            <CardDescription>
              Enter the manufacturing details to generate a QR code for the part.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="partType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-part-type">
                            <SelectValue placeholder="Select part type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Elastic Rail Clip">Elastic Rail Clip</SelectItem>
                          <SelectItem value="Liner Pad">Liner Pad</SelectItem>
                          <SelectItem value="Rail Pad">Rail Pad</SelectItem>
                          <SelectItem value="Concrete Sleeper">Concrete Sleeper</SelectItem>
                          <SelectItem value="Steel Sleeper">Steel Sleeper</SelectItem>
                          <SelectItem value="Fish Plate">Fish Plate</SelectItem>
                          <SelectItem value="Rail Bolt">Rail Bolt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacturingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturing Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mumbai Manufacturing Unit" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materialComposition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Composition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the materials used, specifications, and composition details..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-material"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lotNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lot Number</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="Auto-generated" {...field} data-testid="input-lot" />
                          </FormControl>
                          <Button type="button" variant="outline" onClick={autoGenerateLot} data-testid="button-generate-lot">
                            Generate
                          </Button>
                        </div>
                        <FormDescription>
                          Leave empty to auto-generate or enter manually
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufactureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacture Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-manufacture-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-expiry-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  data-testid="button-submit-part"
                >
                  {isSubmitting ? 'Generating QR Code...' : 'Generate QR Code'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <div className="space-y-6">
          {generatedQR ? (
            <Card data-testid="card-generated-qr">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Generated QR Code
                </CardTitle>
                <CardDescription>
                  Your QR code has been generated successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-muted inline-block">
                  <img 
                    src={generatedQR.dataUrl} 
                    alt="Generated QR Code" 
                    className="w-48 h-48 mx-auto"
                    data-testid="img-qr-code"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">QR Code Data:</p>
                  <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                    {generatedQR.qrCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={downloadQRCode} className="flex-1" data-testid="button-download-qr">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={clearGenerated} variant="outline" data-testid="button-clear-qr">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center" data-testid="card-no-qr">
              <CardContent className="text-center py-12">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No QR Code Generated</h3>
                <p className="text-muted-foreground">
                  Fill out the manufacturing form to generate a QR code for your part.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card data-testid="card-vendor-stats">
            <CardHeader>
              <CardTitle>Your Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-2xl font-bold text-primary" data-testid="text-total-parts">
                    {getStoredParts().filter(p => p.vendorId === user?.id).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Parts Created</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <p className="text-2xl font-bold text-accent" data-testid="text-active-lots">
                    {new Set(getStoredParts().filter(p => p.vendorId === user?.id).map(p => p.lotNumber)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Lots</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard