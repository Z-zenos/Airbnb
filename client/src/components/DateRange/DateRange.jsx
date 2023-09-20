import { useRef, useState } from "react";
import { format } from "date-fns";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import "./DateRange.css";

import useOutsideDetector from "../../hooks/useOutsideDetector";

export default function DateRange() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection"
  };

  function handleSelectDateRange(ranges) {
    setStartDate(() => ranges.selection.startDate);
    setEndDate(() => ranges.selection.endDate);
  }

  const [isDisplayDateRangePicker, setIsDisplayDateRangePicker] = useState(false);


  const dateRangeRef = useRef(null);
  useOutsideDetector(dateRangeRef, "date-range", setIsDisplayDateRangePicker);

  
  function handleClick() {
    dateRangeRef.current.classList[isDisplayDateRangePicker ? 'add' : 'remove']('date-range');
    setIsDisplayDateRangePicker(!isDisplayDateRangePicker);
  }

  return (
    <div ref={dateRangeRef} className="relative flex border border-gray-400 rounded-tl-xl rounded-tr-xl" onClick={handleClick}>
      <div className="w-1/2 p-3 border-r-[1px] border-gray-400">
        <p className="font-medium text-[11px]">CHECK-IN</p>
        <p className="text-sm text-gray-600">{startDate ? format(startDate, 'dd-MM-yyyy') : 'Add date'}</p>
      </div>

      <div className="w-1/2 p-3">
        <p className="font-medium text-[11px]">CHECK-OUT</p>
        <p className="text-sm text-gray-600">{endDate ? format(endDate, 'dd-MM-yyyy') : 'Add date'}</p>
      </div>

      { isDisplayDateRangePicker && <DateRangePicker
          onChange={handleSelectDateRange}
          months={2}
          minDate={new Date()}
          ranges={[selectionRange]}
          direction="horizontal"
          rangeColors={["#ff385c"]}
          className="shadow-md text-black shadow-gray-300 border p-4 bg-white absolute right-[-1px] top-[58px] z-10"
        />
      }

    </div>
  );
}