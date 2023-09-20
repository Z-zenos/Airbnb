import { useEffect } from "react";

export default function useOutsideDetector(ref, className, ...unsetStateList) {

  useEffect(() => {
    function handleClickOutside(ev) {
      if(ref.current && !ref.current.contains(ev.target)) {
        unsetStateList.forEach(us => us(false));

        ref.current.classList.remove(className);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref]);
}