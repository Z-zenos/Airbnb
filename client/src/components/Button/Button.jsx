
export default function Button({ 
  title, className, btnStyle, iconClassName, children, onClick
}) {
  return (
    <button className={className} style={btnStyle} onClick={onClick}>
      <span className={iconClassName}>{children}</span>
      <span>{ title }</span>
    </button>
  );
}