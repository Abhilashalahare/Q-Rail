import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, FileText, Upload, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// TODO: remove mock data - replace with real API calls
const complaintSchema = z.object({
  fittingId: z.string().min(1, "Fitting ID is required"),
  issueType: z.string().min(1, "Issue type is required"),
  priority: z.string().min(1, "Priority is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  reporterName: z.string().min(1, "Reporter name is required"),
  reporterEmail: z.string().email("Valid email is required"),
})

type ComplaintForm = z.infer<typeof complaintSchema>

const mockComplaints = [
  {
    id: "CMP-001",
    fittingId: "RC-2024-001",
    issueType: "Physical Damage",
    priority: "high",
    status: "open",
    description: "Cracks observed on rail clip surface",
    location: "Track Section 12-A",
    submittedBy: "Inspector John",
    submittedAt: "2024-12-10"
  },
  {
    id: "CMP-002",
    fittingId: "LP-2024-002",
    issueType: "Wear & Tear",
    priority: "medium",
    status: "in-progress",
    description: "Excessive wear on liner pad edges",
    location: "Junction Point 7-B",
    submittedBy: "Inspector Sarah",
    submittedAt: "2024-12-08"
  },
  {
    id: "CMP-003",
    fittingId: "SL-2023-003",
    issueType: "Manufacturing Defect",
    priority: "high",
    status: "resolved",
    description: "Improper concrete mix causing structural weakness",
    location: "Bridge Section 3-C",
    submittedBy: "Inspector Mike",
    submittedAt: "2024-12-05"
  }
]

export function ComplaintsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      fittingId: "",
      issueType: "",
      priority: "",
      description: "",
      location: "",
      reporterName: "",
      reporterEmail: "",
    },
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast({
        title: "File Uploaded",
        description: `Selected: ${file.name}`
      })
    }
  }

  const onSubmit = (data: ComplaintForm) => {
    setIsSubmitting(true)
    // TODO: replace with real API call
    setTimeout(() => {
      console.log('Complaint submitted:', { ...data, file: selectedFile })
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been registered and assigned ID: CMP-004"
      })
      form.reset()
      setSelectedFile(null)
      setIsSubmitting(false)
    }, 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-chart-5/10 text-chart-5 border-chart-5/20'
      case 'medium': return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'low': return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
      default: return 'bg-muted/10 text-muted-foreground border-muted/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
      case 'in-progress': return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'open': return 'bg-chart-5/10 text-chart-5 border-chart-5/20'
      default: return 'bg-muted/10 text-muted-foreground border-muted/20'
    }
  }

  return (
    <div className="p-6 space-y-6" data-testid="page-complaints">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Complaint Registration</h1>
        <p className="text-muted-foreground">
          Report issues with track fittings for investigation and resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Form */}
        <Card data-testid="card-complaint-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit New Complaint
            </CardTitle>
            <CardDescription>
              Provide detailed information about the defective fitting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fittingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fitting ID / QR Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., RC-2024-001" {...field} data-testid="input-fitting-id" />
                        </FormControl>
                        <FormDescription>
                          Enter the QR code from the defective fitting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issueType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-issue-type">
                              <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="physical-damage">Physical Damage</SelectItem>
                            <SelectItem value="wear-tear">Wear & Tear</SelectItem>
                            <SelectItem value="manufacturing-defect">Manufacturing Defect</SelectItem>
                            <SelectItem value="installation-issue">Installation Issue</SelectItem>
                            <SelectItem value="performance-issue">Performance Issue</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Routine maintenance</SelectItem>
                            <SelectItem value="medium">Medium - Schedule repair</SelectItem>
                            <SelectItem value="high">High - Immediate attention</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Track Section 12-A" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the issue in detail, including when it was discovered, visual observations, and any safety concerns..."
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reporterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporter Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} data-testid="input-reporter-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reporterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@railways.gov.in" {...field} data-testid="input-reporter-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="file-upload">Attach Photos (Optional)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="mt-1"
                    data-testid="input-file-upload"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  data-testid="button-submit-complaint"
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card data-testid="card-recent-complaints">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Complaints
            </CardTitle>
            <CardDescription>
              Track the status of previously submitted complaints.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockComplaints.map((complaint) => (
                <div 
                  key={complaint.id} 
                  className="p-4 border rounded-lg hover-elevate"
                  data-testid={`complaint-item-${complaint.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {complaint.id}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                        {complaint.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-semibold">{complaint.issueType}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <p><strong>Fitting:</strong> {complaint.fittingId}</p>
                    <p><strong>Location:</strong> {complaint.location}</p>
                    <p><strong>Reporter:</strong> {complaint.submittedBy}</p>
                    <p><strong>Date:</strong> {complaint.submittedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComplaintsPage