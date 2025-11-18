type StatItemProps = {
  icon: string;
  label: string;
  qty: number
}
function StatItem({icon, label, qty}: StatItemProps) {
  return (
    <div className="stat-item">
      <img className="stat-icon" src={icon} />
      <p className="stat-qty">{qty}</p>
      <p className="stat-label">{label}</p>
    </div>
  )
}

export default StatItem;