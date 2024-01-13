import "./Spinner.css";

export default function Spinner({ className }) {
  return (
    <div className={`lds-ellipsis ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}