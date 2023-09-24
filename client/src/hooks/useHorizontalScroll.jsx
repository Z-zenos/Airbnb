import { useEffect, useRef } from "react";

export default function useHorizontalScroll() {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if(el) {
      const onWheel = e => {
        if(e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: 'smooth'
        });
      };

      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return elRef;
}