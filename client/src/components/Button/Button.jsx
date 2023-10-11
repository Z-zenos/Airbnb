
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
        hover:opacity-80
        transition
        px-4
        ${outline ? 'bg-white' : 'bg-rose-500'}
        ${outline ? 'border-black' : 'border-rose-500'}
        ${outline ? 'text-black' : 'text-white'}
        ${small ? 'py-2' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${small ? 'border-[1px]' : 'border-2'}
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