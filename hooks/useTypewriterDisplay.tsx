import { useEffect, useState } from "react";

type T_SetTypewriterString = (typewriterString: string, millisecondDelayPerCharacterTyped?: number) => void

/**
 * Custom hook to show a string with a typewriter effect.
 */
export const useTypewriterDisplay = (): [string, T_SetTypewriterString] => {
  const [typewriterString, setTypewriterStringState] = useState<string>("")
  const [initialTypewriterString, setInitialTypewriterString] = useState<string>("")
  const [stringIndex, setStringIndex] = useState<number>(0)
  const [millisDelay, setMillisDelay] = useState<number>(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const resetInterval = () => {
    if (!intervalId) return;
    clearTimeout(intervalId)
    setIntervalId(null)
  }

  const typewriterNext = () => {
    const nextChar = initialTypewriterString[stringIndex]
    if (nextChar === undefined) return resetInterval();
    setTypewriterStringState(typewriterString + nextChar)
    setStringIndex(stringIndex + 1)
  }

  const setTypewriterString = (
    stringToTypewright: string,
    millisecondDelayPerCharacterTyped: number = 35
  ) => {
    resetInterval()
    setInitialTypewriterString(stringToTypewright)
    setMillisDelay(millisecondDelayPerCharacterTyped)
    setTypewriterStringState("")
    setStringIndex(0)
  }

  useEffect(() => {
    if (stringIndex >= initialTypewriterString.length) return;

    setIntervalId(setTimeout(typewriterNext, millisDelay))

  }, [stringIndex, initialTypewriterString])

  return [typewriterString, setTypewriterString];
}
