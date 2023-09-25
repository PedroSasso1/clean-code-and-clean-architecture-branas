import Position from '../../src/domain/Position';
import Ride from '../../src/domain/Ride';

test('Deve criar uma position', function () {
  const position = Position.create('', 0, 0);
  expect(position.positionId).toBeDefined();
  expect(position.date).toBeDefined();
});