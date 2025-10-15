import "../../stylesheets/PlanBubble.css";

// Placeholder interface for future props or context integration
interface PlanBubbleProps {
  wateringTime?: string; 
  fanStatus?: string;    
}

export default function PlanBubble({
  wateringTime = "Not Set", // default placeholders
  fanStatus = "Not Set",      
}: PlanBubbleProps) {
  // Placeholder list for when you eventually map more plan items dynamically
  const planItems = [
    { label: "Watering", value: wateringTime },
    { label: "Fan", value: fanStatus },
  ];

  return (
    <div className="plan-bubble">
      <div className="plan-title">Today’s Plan</div>
      {planItems.map((item, index) => (
        <div className="plan-row" key={index}>
          <div className="plan-label">{item.label}</div>
          <div className="plan-spacer" />
          <div className="plan-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
