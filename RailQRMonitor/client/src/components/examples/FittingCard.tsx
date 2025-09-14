import FittingCard from '../FittingCard'

const mockFitting = {
  id: "1",
  qrCode: "RC-2024-001",
  type: "Elastic Rail Clip",
  vendor: "RailTech Industries",
  lotNumber: "RT-2024-A47",
  supplyDate: "2024-01-15",
  warrantyExpiry: "2027-01-15",
  lastInspection: "2024-11-01",
  status: "ok" as const,
  location: "Track Section 12-A"
}

export default function FittingCardExample() {
  return <FittingCard fitting={mockFitting} />
}