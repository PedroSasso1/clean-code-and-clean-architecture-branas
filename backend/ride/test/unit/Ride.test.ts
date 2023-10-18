import Ride from '../../src/domain/Ride';

test('Deve criar uma ride', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  expect(ride.rideId).toBeDefined();
  expect(ride.getStatus()).toBe('requested');
});
test('Deve gerar erro ao aceitar uma ride com o status diferente de requested', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  ride.accept("")
  expect(() => ride.accept("")).toThrow(new Error("Invalid Status"))
});

test('Deve aceitar uma ride', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  ride.accept("")
  expect(ride.getStatus()).toBe('accepted');
});

test('Deve gerar erro ao inicar uma ride com o status diferente de accepted', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  ride.accept("")
  ride.start()
  expect(() => ride.start()).toThrow(new Error("Invalid Status"))
});

test('Deve inciar uma ride', function () {
  const ride = Ride.create('', 0, 0, 0, 0);
  ride.accept("")
  ride.start()
  expect(ride.getStatus()).toBe('in_progress');
});

