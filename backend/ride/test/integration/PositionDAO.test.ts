import PositionDAO from '../../src/application/repository/PositionDAO';
import PositionDAODatabase from '../../src/infra/repository/PositionDAODatabase';
import Connection from '../../src/infra/database/Connection';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import Ride from '../../src/domain/Ride';
import Position from '../../src/domain/Position';

let connection: Connection;
let positionDAO: PositionDAO;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  positionDAO = new PositionDAODatabase(connection);
})

test('Deve criar um registro na tabela position e consulta-la por id', async function () {
  const ride = Ride.create("", 0, 0, 0, 0);
  ride.accept("")
  ride.start()
  const position = Position.create(ride.rideId, 1, 1)
  await positionDAO.save(position)
  const savedPosition = await positionDAO.getById(position.positionId);
  expect(savedPosition?.positionId).toBeDefined();
  expect(savedPosition?.rideId).toBe(position.rideId);
  expect(savedPosition?.lat).toBe(1);
  expect(savedPosition?.long).toBe(1);
  expect(savedPosition?.date).toBeDefined();
});

afterEach(async function () {
  await connection.close();
}) 