import { useRef, useState } from "react";
import "./Input.css";

export default function Input({ 
  label = 'Input', type = 'text', className = "", name,
  onChange, value, disabled, required, readOnly,
  wrapperStyle, inputStyle, error, beforeText
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
  function handleClick() {
    if(inputRef && inputRef.current) inputRef.current.focus();
  }

  return (
    <div 
      className={"input-container relative border border-gray-400 pt-6 pb-2 px-5 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400 flex flex-row justify-start items-center " + className} 
      style={wrapperStyle}
      onClick={handleClick}
    >
      { (isFocused && (value || beforeText)) && <span className={"text-gray-500 text-sm -translate-x-[3px] " + (value ? "" : "w-7 mr-2")}>{beforeText}</span> }
      <input 
        ref={inputRef}
        className="w-full inline h-full focus:border-none focus:outline-none text-[16px] "
        type={type} 
        value={value} 
        onChange={onChange}
        style={inputStyle}
        disabled={disabled}
        readOnly={readOnly}
        name={name}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
      </input>
      {label && <label className={value && 'filled'} htmlFor={name}>{label}</label> }
      { error && <p className="absolute top-2 right-3 text-primary text-xs">{error}</p> }
    </div>
  );
}
