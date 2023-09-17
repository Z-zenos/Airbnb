
export default function Button({ 
  title, className, btnStyle, iconClassName, children 
}) {
  return (
    <button className={className} style={btnStyle}>
      <span className={iconClassName}>{children}</span>
      <span>{ title }</span>
    </button>
  );
}