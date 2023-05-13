const bloodPressureColors = {
    low: "#42598A",
    healthy: "#4FB6F0",
    elevated: "#F7D13B",
    hypertensionOne: "#FFB938",
    hypertensionTwo: "#E74C3C",
    extremelyHigh: "#B40F0F"
}

export const buildColorStyleFromBloodPressure = (systolic: number, diastolic: number) => {
    // TODO: write tests!
    // Low blood pressure
    if (systolic < 95 && diastolic <= 60) return {color: bloodPressureColors.low}
    // Normal blood pressure
    if (systolic <= 120 && diastolic <= 80) return {color: bloodPressureColors.healthy}
    // Elevated Blood Pressure
    if (systolic <= 130 && diastolic <= 80) return {color: bloodPressureColors.elevated}
    // Hypertension I
    if (systolic <= 140 || diastolic <= 90) return {color: bloodPressureColors.hypertensionOne}
    // Hypertension II
    if (systolic < 180 || diastolic < 120) return {color: bloodPressureColors.hypertensionTwo}
    // Please see a doctor now
    if (systolic >= 180 || diastolic >= 120) return {color: bloodPressureColors.extremelyHigh}
}