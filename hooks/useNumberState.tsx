import { useState } from "react";

type T_SetNumberStateHook = (newValue: string) => void;

/** Custom useState hook that only allows number characters */
export const useNumberState = (initialValue: string): [string, T_SetNumberStateHook] => {
    const [displayNumber, setDisplayNumber] = useState(initialValue)

    const _setNumber = (newValue: string) => {
        setDisplayNumber(newValue.replace(/\D*/g, ''))
    }

    return [displayNumber, _setNumber]
}