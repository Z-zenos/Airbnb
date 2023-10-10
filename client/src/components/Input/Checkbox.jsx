import { useState } from "react";
import capitailizeFirstLetter from "../../utils/capitalizeFirstLetter";
import "./Input.css";

export default function Checkbox({ label, checked, ...props }) {

  return (
    <div className="checkbox my-2">
      <label className="cursor-pointer flex items-center">
        <input 
          type="checkbox" 
          checked={checked} 
          className={checked ? 'checked' : ''}
          {...props}
        />
        <span className="font-light ml-2 text-[18px]">{ capitailizeFirstLetter(label)}</span>
      </label>
    </div>
  );
}