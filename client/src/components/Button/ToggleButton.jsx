import "./Button.css";

export default function ToggleButton({ selected, onClick }) {
  return (
    <div className="toggle-container" onClick={onClick}>
      <div className={`dialog-button ${selected ? '' : 'disabled'}`}>
        {selected ? 'Yes' : 'No' }
      </div>
    </div>
  )
}