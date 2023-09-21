import { createContext, useState } from "react";

export const PlaceContext = createContext({});

// eslint-disable-next-line react/prop-types
export function PlaceContextProvider({ children }) {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());

  const selectionRange = {
    startDate: checkInDate,
    endDate: checkOutDate,
    key: "selection"
  };

  function handleSelectDateRange(ranges) {
    setCheckInDate(() => ranges.selection.startDate);
    setCheckOutDate(() => ranges.selection.endDate);
  }

  return (
    <PlaceContext.Provider value={{
      checkInDate,
      checkOutDate,
      setCheckInDate,
      setCheckOutDate,
      selectionRange,
      handleSelectDateRange
    }}>
      { children }
    </PlaceContext.Provider>
  );
}