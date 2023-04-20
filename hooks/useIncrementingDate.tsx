import { useEffect, useState } from "react";

type T_useIncrementingDate = [
  Date,
  React.Dispatch<React.SetStateAction<Date>>,
  () => void
]

/**
 * Custom hook to store a date to state, with its time incrementing.
 *
 * @param neverIncrement false if this should start incrementing, and true if it should just return a date
 */
export const useIncrementingDateTime = (initialDate: Date = new Date(), neverIncrement: boolean = false): T_useIncrementingDate => {
  const [date,       setDate      ] = useState(initialDate);
  const [intervalId, setIntervalId] = useState(null);

  const stopIncrementing = () => {
    if (!intervalId) return;
    clearTimeout(intervalId)
    setIntervalId(null)
  }

  const incrementDate = () => setDate(new Date())

  useEffect(() => {
    if (neverIncrement) return;

    setIntervalId(setInterval(incrementDate, 100))

    return () => stopIncrementing()
  }, [])

  return [date, setDate, stopIncrementing];
}
