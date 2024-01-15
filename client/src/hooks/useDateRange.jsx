import { useState } from "react";

export default function useDateRange(
  checkin,
  checkout,
) {
  const [checkInDate, setCheckInDate] = useState(
    checkin ? new Date(checkin) : new Date()
  );
  const [checkOutDate, setCheckOutDate] = useState(
    checkout ? new Date(checkout) : new Date()
  );

  const selectionRange = {
    startDate: checkInDate,
    endDate: checkOutDate,
    key: "selection"
  };

  function handleSelectDateRange(ranges) {
    setCheckInDate(() => ranges.selection.startDate);
    setCheckOutDate(() => ranges.selection.endDate);
  }

  return {
    checkInDate,
    checkOutDate,
    selectionRange,
    handleSelectDateRange
  };
}