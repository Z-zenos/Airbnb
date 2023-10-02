import { useState } from "react";
import "./Input.css";

export default function Input2(props) {
  const { 
    id, label, type = "text", disabled, beforeText,
    register, errors, className, validate, required
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  function handleClick(ev) {
    const wrapper = ev.target;
    const inputEl = wrapper.querySelector("input");
    inputEl && inputEl.focus();
  }

  return (
    <div 
      className={"input-container relative border border-gray-400 pt-6 pb-2 px-5 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400 flex flex-row justify-start items-center gap-1 " + className} 
      onClick={handleClick}
      onBlur={() => setIsFocused(false)}
    >
      { (isFocused && beforeText) && <span className={"text-gray-500 text-sm -translate-x-[3px] "}>{beforeText}</span> }

      <input 
        className="w-full inline h-full focus:border-none focus:outline-none text-[16px] "
        onFocus={() => setIsFocused(true)}
        id={id}
        name={id}
        {...register(id, validate)}
        type={type}
        required={required}
        disabled={disabled}
      >
      </input>
      {label && <label className={'filled'} htmlFor={label}>{label}</label> }
      { (errors?.[id]) && <p className="absolute top-[7px] right-3 text-primary text-xs">{errors?.[id]?.message}</p> }
    </div>
  );
}
