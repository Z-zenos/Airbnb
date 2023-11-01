
const Button = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
  children,
  className,
  iconClassName
}) => {
  return ( 
    <button
      disabled={disabled}
      onClick={onClick}
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
      {label}
    </button>
  );
}

export default Button;