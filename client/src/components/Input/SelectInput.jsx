
export default function SelectInput({
  className, data, value, onChange, label,
  optionValueTitle, optionDisplayFormat
}) {
  function formatOption(data) {
    return optionDisplayFormat.replace(/\w+/g, (w) => data[w]);
  }

  return (
    <div 
      className={`
        relative border border-gray-400 pt-6 pb-2 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400 
        ${className}
      `}
    >
      <select 
        className="relative w-full h-full focus:border-none focus:outline-none bg-transparent text-[16px] px-[18px] cursor-pointer appearance-none "
        name="country"
        value={value}
        onChange={onChange}
      >
        { data && data.length && data.map((d, i) => 
          <option key={d[optionValueTitle] + i} value={d[optionValueTitle]}>
            {formatOption(d)}
          </option>) 
        }
      </select>

      <label 
        className="absolute pointer-events-none scale-90 left-[12px] text-gray-500 top-[6px] text-[14px]" htmlFor="country"
      >
        {label}
      </label>

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>

    </div>
  )
}