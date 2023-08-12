import { buildColorStyleFromBloodPressure, bloodPressureColors } from '../../src/conversions/bloodPressureStyles';

describe('buildColorStyleFromBloodPressure', () => {
  const testCases = [
    // Test cases exactly on the expected values
    { systolic: 90, diastolic: 60, expectedColorStyle: bloodPressureColors.low },
    { systolic: 120, diastolic: 80, expectedColorStyle: bloodPressureColors.healthy },
    { systolic: 130, diastolic: 80, expectedColorStyle: bloodPressureColors.elevated },
    { systolic: 140, diastolic: 90, expectedColorStyle: bloodPressureColors.hypertensionOne },
    { systolic: 150, diastolic: 100, expectedColorStyle: bloodPressureColors.hypertensionTwo },
    { systolic: 200, diastolic: 120, expectedColorStyle: bloodPressureColors.extremelyHigh },

    // Edge cases - one number alone passes the `if` check
    { systolic: 112, diastolic: 59, expectedColorStyle: bloodPressureColors.healthy },
    { systolic: 129, diastolic: 69, expectedColorStyle: bloodPressureColors.healthy },
    { systolic: 112, diastolic: 81, expectedColorStyle: bloodPressureColors.hypertensionOne },
    { systolic: 142, diastolic: 86, expectedColorStyle: bloodPressureColors.hypertensionTwo },
    { systolic: 156, diastolic: 120, expectedColorStyle: bloodPressureColors.extremelyHigh },
];

  test.each(testCases)(
    'should return the correct color style for blood pressure: systolic=%p, diastolic=%p',
    ({ systolic, diastolic, expectedColorStyle }) => {
      const result = buildColorStyleFromBloodPressure(systolic, diastolic);
      expect(result).toEqual(expectedColorStyle);
    }
  );
});
