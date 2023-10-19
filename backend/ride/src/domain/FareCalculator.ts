// Strategy Pattern
export default interface FareCalculator {
  calculate(distance: number): number;
}

export class NormalFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 2.1;
  }
}

export class OverNightFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 5;
  }
}

export class FareCalculatorFactory {
  static create(date: Date) {
    if (date.getHours() >= 6 && date.getHours() <= 23)
      return new NormalFareCalculator();
    if (date.getHours() < 6 || date.getHours() > 23)
      return new OverNightFareCalculator();
    throw new Error('Invalid Fare');
  }
}
