

const CategoryInput = ({
  iconSrc, label, selected, onClick, id = label
}) => {
  return ( 
    <div
      onClick={() => onClick(id)}
      className={`
        rounded-xl
        border-2
        p-4
        flex
        gap-5
        items-center
        hover:border-black
        transition
        cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}
      `}
    >
      <img src={iconSrc} className="w-8" />
      <div className="font-medium text-sm">
        {label}
      </div>
    </div>
  );
}


export default CategoryInput;