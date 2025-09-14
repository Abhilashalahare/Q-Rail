import StatusBadge from '../StatusBadge'

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-4 flex-wrap">
      <StatusBadge status="ok" />
      <StatusBadge status="warning" />
      <StatusBadge status="defective" />
    </div>
  )
}