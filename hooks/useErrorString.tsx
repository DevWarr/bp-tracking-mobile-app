import { useState } from "react";

type T_SetErrorStringHook = (errorString: string, millisecondDelayForErrorToGoAway?: number) => void

/**
 * Custom hook to show an error, and then erase it after a set amount of time.
 */
export const useErrorString = (): [string, T_SetErrorStringHook] => {
  const [errorString, setErrorStringState] = useState<string>("")
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const resetTimout = () => {
    if (!timeoutId) return;
    console.log({timeoutId, from: "reset"})
    clearTimeout(timeoutId)
    setTimeoutId(null)
  }

  const setErrorString = (
    errorString: string,
    millisecondDelayForErrorToGoAway: number = 2000
  ) => {
    console.log({timeoutId, from: "errorFound"})
    resetTimout()
    setErrorStringState(errorString)
    console.log({timeoutId, from: "setString"})

    setTimeoutId(
      setTimeout(() => {
        console.log({timeoutId, from: "setTimeout"})
        resetTimout()
        setErrorStringState("")
      }, millisecondDelayForErrorToGoAway)
    )
  }

  return [errorString, setErrorString];
}
