import { GoDotFill } from "react-icons/go";
import "./Input.css";

export default function Inputv2(props) {
  const { 
    name, label, register, errors, required, value,
    type, validationSchema, className, onChange
  } = props;


  function handleClick(ev) {
    const wrapper = ev.target;
    const inputEl = wrapper.querySelector("input");
    inputEl && inputEl.focus();
  }

  return (
    <>
      <div 
        className={"input-container relative border border-gray-400 pt-6 pb-2 px-5 focus-within:rounded-md focus-within:outline focus-within:outline-black focus-within:outline-2 focus-within:outline-offset-1 focus-within:border-y-gray-400 flex flex-row justify-start items-center gap-1 " + className} 
        onClick={handleClick}
      >
        <input 
          className="w-full inline h-full focus:border-none focus:outline-none text-[16px] "
          id={name}
          name={name}
          type={type}
          aria-invalid={errors[name] ? "true" : "false"}
          {...register(name, {...validationSchema, onChange: onChange })}
        >
        </input>

        { label && 
          <label className={value && 'filled'} htmlFor={name}>
            { label }
            { required && "*" }
          </label> 
        }

      </div>
      { (errors[name]) && 
        <p className="flex items-center text-primary text-xs mt-[-4px]">
          <GoDotFill className="inline mr-2" /> {errors[name]?.message}
        </p> 
      }
    </>
  );
}
