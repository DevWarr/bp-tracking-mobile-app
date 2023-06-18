export const bloodPressureColors = {
    low: "#42598A",
    healthy: "#4FB6F0",
    elevated: "#F7D13B",
    hypertensionOne: "#FFB938",
    hypertensionTwo: "#E74C3C",
    extremelyHigh: "#B40F0F"
}

/**
 * Funtion that returns the proper color coding based on the blood pressure.
 * 
 * Low and high blood pressures are calculated first,
 * and normal blood pressure is the final return statement.
 * 
 * @returns Hex code of the blood pressure color
 */
export const buildColorStyleFromBloodPressure = (systolic: number, diastolic: number) => {
    // Extremely high - please see a doctor now
    if (systolic >= 180 || diastolic >= 120) return bloodPressureColors.extremelyHigh
    // Hypertension II
    if (systolic > 140 || diastolic > 90) return bloodPressureColors.hypertensionTwo
    // Hypertension I
    if (systolic > 130 || diastolic > 80) return bloodPressureColors.hypertensionOne
    // Elevated Blood Pressure
    if (systolic > 125 && diastolic > 70) return bloodPressureColors.elevated

    // Low blood pressure
    if (systolic < 95 && diastolic <= 60) return bloodPressureColors.low

    // Normal blood pressure
    //if (systolic <= 120 && diastolic <= 80)
    return bloodPressureColors.healthy
}
