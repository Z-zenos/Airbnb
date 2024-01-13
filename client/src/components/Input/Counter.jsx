
import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const sizeCounter = {
  big: '',
  medium: 'w-10 h-10',
  small: 'w-8 h-8'
};

export default function Counter({
  title, subtitle, value, onChange, 
  plussedNumber = 1, max = 50, min = 1,
  size = sizeCounter.medium
}) {
  const onAdd = useCallback(() => {
    if(value === max) return;

    onChange(value + plussedNumber);
  }, [onChange, value, max, plussedNumber]);

  const onReduce = useCallback(() => {
    if(value === min) return;

    onChange(value - plussedNumber);
  }, [onChange, value, plussedNumber, min]);

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-800 text-sm">{subtitle}</div>
      </div>

      <div className="flex flex-row items-center gap-4">
        <div
          className={`${sizeCounter[size]} rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition ${value === min ? ' opacity-50 cursor-auto pointer-events-none' : ''}`}
          onClick={onReduce}
        >
          <AiOutlineMinus />
        </div>

        <div className="font-light text-xl text-neutral-600">
          {value}
        </div>

        <div
          className={`${sizeCounter[size]} rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition ${value === max ? ' opacity-50 cursor-auto pointer-events-none' : ''}`}
          onClick={onAdd}
        >
          <AiOutlinePlus />
        </div>

      </div>
    </div>
  )
}