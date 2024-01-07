import { forwardRef } from "react";
import "./Input.css";

function CustomInput(props, ref) {
  const { 
    label, className, name, value,
    wrapperStyle, errors, beforeText,
    ...rest
  } = props;

  function handleClick(ev) {
    const wrapper = ev.target;
    const inputEl = wrapper.querySelector("input");
    inputEl && inputEl.focus();
  }

  return (
    <div 
      className={"input-container relative border border-gray-400 pt-6 pb-2 px-5 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400 flex flex-row justify-start items-center gap-1 " + className} 
      style={wrapperStyle}
      onClick={handleClick}
    >
      { (value || beforeText) && <span className={"text-gray-500 text-sm -translate-x-[3px] " + (value ? "" : "w-7 mr-2")}>{beforeText}</span> }
      
      {/* 
        This is the correct answer given @Joris's solution would override the change handler spread from {...register('name')} which returns {onChange, onBlur, name, ref}, and this could lead to bugs. 
        sgarcia.dev - Dec 3, 2021 at 18:16
      */}
      <input 
        className="w-full inline h-full focus:border-none focus:outline-none text-[16px] "
        name={name}
        ref={ref}
        value={value}
        aria-invalid={errors?.[name] ? "true" : "false"}
        {...rest}
      >
      </input>
      {label && <label className={(value || beforeText) && 'filled'} htmlFor={name}>{label}</label> }
      { (errors?.[name] && value) && <p className="absolute top-[7px] right-3 text-primary text-xs">{errors?.[name]?.message}</p> }
    </div>
  )
}

const Input = forwardRef(CustomInput);
export default Input;