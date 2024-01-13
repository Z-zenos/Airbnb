
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import "./Input.css";
import { useState } from "react";
import Counter from "./Counter";

export default function GuestInput({ 
  guests, setGuests,
  className, pets_allowed, max_guests, max_children, max_pets
}) {
  const [isOpenGuestMenu, setIsOpenGuestMenu] = useState(false);

  function handleChangeGuests(typeGuest, value) {
    setGuests(prev => {
      const newGuests = {
        ...prev,
        [typeGuest]: value
      };
      return ({
        ...newGuests,
        total: newGuests.adults + newGuests.children + newGuests.pets
      });
    });
  }

  return (
    <div className={`
        input-container relative border border-gray-400 
        pt-6 pb-2 px-5 focus-within:rounded-md focus-within:outline 
        focus-within:outline-black focus-within:outline-2 
        focus-within:outline-offset-1 focus-within:border-y-gray-400 
        flex flex-row justify-start items-center gap-1 
        ${className}
      `}
    >
      <input 
        className="w-full inline h-full focus:border-none focus:outline-none text-[16px] text-sm -ml-[4px] cursor-pointer"
        value={`${guests.total} guests`}
        readOnly
        onClick={() => setIsOpenGuestMenu(!isOpenGuestMenu)}
      >
      </input>
      <label className="filled !text-[11px] -ml-[3px] font-semibold !text-black">GUESTS</label>
        
      <span className="cursor-pointer" onClick={() => setIsOpenGuestMenu(!isOpenGuestMenu)}>
        { !isOpenGuestMenu ? <IoIosArrowDown /> : <IoIosArrowUp /> }
      </span>
      { isOpenGuestMenu && (
        <div className="absolute top-12 w-[110%] shadow-[rgba(0,_0,_0,_0.15)_0px_2px_6px_0px,_rgba(0,_0,_0,_0.07)_0px_0px_0px_1px] py-6 px-4 flex flex-col gap-8 bg-white rounded-lg right-0 z-10">
          <Counter
            onChange={(value) => handleChangeGuests('adults', value)}
            value={guests.adults}
            title="Adults" 
            subtitle="Ages 13+"
            max={max_guests - guests.children}
            min={0}
            size="small"
          />
          <Counter 
            onChange={(value) => handleChangeGuests('children', value)}
            value={guests.children}
            title="Children" 
            subtitle="Ages 2 - 12"
            max={max_guests - guests.adults > max_children ? max_children : max_guests - guests.adults}
            size="small"
            min={0}
          />
          <Counter 
            onChange={(value) => handleChangeGuests('pets', value)}
            value={guests.pets}
            title="Pets" 
            subtitle="Bringing a service animal?"
            max={max_pets}
            size="small"
            min={0}
          />

          <p className="text-sm font-light">
            <span>This place has a maximum of {max_guests} guests</span>
            <span>{max_children ? `, ${max_children} children, ` : ", not including children, "}</span>
            <span>{pets_allowed ? `and ${max_pets} pets` : "and pets aren't allowed"}.</span>
          </p>
          <p className="text-right cursor-pointer underline" onClick={() => setIsOpenGuestMenu(false)}>Close</p>
        </div>
      )}
    </div>
  )
}