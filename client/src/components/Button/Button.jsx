
const Button = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
  children,
  className,
  iconClassName,
  style,
  isLoading
}) => {
  return ( 
    <button
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`
        rounded-lg
        transition
        px-4
        ${outline ? 'bg-white' : 'bg-primary'}
        ${outline ? 'border-black' : 'border-primary'}
        ${outline ? 'text-black' : 'text-white'}
        ${small ? 'py-2' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${small ? 'border-[1px]' : 'border-[1px]'}
        ${disabled ? 'disabled:pointer-events-none disabled:bg-gray-600 disabled:border-gray-600 disabled:cursor-not-allowed ' : ''}
        ${children ? 'flex items-center gap-1' : ''}
        ${className}
      `}
    >
      <span className={iconClassName}>{children}</span>
      {isLoading && <svg className="border-[3px] border-[rgba(0,_0,_0,_0.1)] border-t-white border-r-white inline-block animate-spin h-5 w-5 mr-3 rounded-[50%]" viewBox="0 0 24 24"></svg>}
      {label}
    </button>
  );
}

export default Button;