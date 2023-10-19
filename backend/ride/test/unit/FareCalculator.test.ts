import { FareCalculatorFactory } from '../../src/domain/FareCalculator';

test('Deve calcular o valor da tarifa com base na distância', function () {
  const distance = 10;
  const date = new Date('2023-10-19T10:00:00');
  const fareCalculator = FareCalculatorFactory.create(date);
  const fare = fareCalculator.calculate(distance);
  expect(fare).toBe(21);
});