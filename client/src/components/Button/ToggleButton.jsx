import "./Button.css";

export default function ToggleButton({ 
  selected, onClick, className 
}) {
  return (
    <div 
      className={`toggle-container ${className}`} 
      onClick={onClick}
    >
      <div className={`dialog-button ${selected ? '' : 'disabled'}`}>
        {selected ? 'Yes' : 'No' }
      </div>
    </div>
  )
}