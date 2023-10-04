
const Button = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
}) => {
  return ( 
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        rounded-lg
        hover:opacity-80
        transition
        w-full
        ${outline ? 'bg-white' : 'bg-rose-500'}
        ${outline ? 'border-black' : 'border-rose-500'}
        ${outline ? 'text-black' : 'text-white'}
        ${small ? 'text-sm' : 'text-md'}
        ${small ? 'py-1' : 'py-3'}
        ${small ? 'font-light' : 'font-semibold'}
        ${small ? 'border-[1px]' : 'border-2'}
        ${disabled ? 'disabled:pointer-events-none disabled:bg-gray-600 disabled:border-gray-600 disabled:cursor-not-allowed ' : ''}
      `}
    >
      {/* {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )} */}
      {label}
    </button>
  );
}

export default Button;