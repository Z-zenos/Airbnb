
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "./Input.css";
import { useState } from "react";
import Counter from "./Counter";

export default function GuestInput({ className }) {
  const [isOpenGuestMenu, setIsOpenGuestMenu] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState( 0);
  const [pets, setPets] = useState(0);

  return (
    <div className={`
        input-container relative border border-gray-400 
        pt-6 pb-2 px-5 
        focus-within:rounded-md focus-within:outline 
        focus-within:outline-black focus-within:outline-2 
        focus-within:outline-offset-1 focus-within:border-y-gray-400 
        flex flex-row justify-start items-center gap-1 
        ${className}
      `}
      
    >
      <input 
        className="w-full inline h-full focus:border-none focus:outline-none text-[16px] text-sm -ml-[4px] cursor-pointer"
        value={`1 guests`}
        onClick={() => setIsOpenGuestMenu(!isOpenGuestMenu)}
      >
      </input>
      <label className="filled !text-[11px] -ml-[3px] font-semibold !text-black">GUESTS</label>
      { !isOpenGuestMenu ? <IoIosArrowDown /> : <IoIosArrowUp /> }
      { isOpenGuestMenu && (
        <div className="absolute top-12 w-[110%] shadow-[rgba(0,_0,_0,_0.15)_0px_2px_6px_0px,_rgba(0,_0,_0,_0.07)_0px_0px_0px_1px] py-6 px-4 flex flex-col gap-8 bg-white rounded-lg right-0 z-10">
          <Counter
            onChange={(value) => setAdults(value)}
            value={adults}
            title="Adults" 
            subtitle="Ages 13+"
            max={16}
            min={0}
            size="small"
          />
          <Counter 
            onChange={(value) => setChildren(value)}
            value={children}
            title="Children" 
            subtitle="Ages 2 - 12"
            max={10}
            size="small"
            min={0}
          />
          <Counter 
            onChange={(value) => setPets(value)}
            value={pets}
            title="Pets" 
            subtitle="Bringing a service animal?"
            max={3}
            size="small"
            min={0}
          />

          <p className="text-sm font-light">This place has a maximum of 2 guests. Pets aren&lsquo;t allowed.</p>
          <p className="text-right cursor-pointer underline" onClick={() => setIsOpenGuestMenu(false)}>Close</p>
        </div>
      )}
    </div>
  )
}