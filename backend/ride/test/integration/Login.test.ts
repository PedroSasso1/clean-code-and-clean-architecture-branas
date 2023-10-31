import RepositoryFactory from '../../src/application/factory/RepositoryFactory';
import Login from '../../src/application/usecase/Login';
import Signup from '../../src/application/usecase/Signup';
import Connection from "../../src/infra/database/Connection";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import RepositoryDatabaseFactory from "../../src/infra/factory/RepositoryDatabaseFactory";

let connection: Connection;
let repositoryFactory: RepositoryFactory;
let signup: Signup;
let login: Login;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  repositoryFactory = new RepositoryDatabaseFactory(connection);
  signup = new Signup(repositoryFactory);
  login = new Login(repositoryFactory);
});

test('Deve fazer um login', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: '',
    password: '123456'
  };
  await signup.execute(inputSignup);
  const inputLogin = {
    email: inputSignup.email,
    password: inputSignup.password,
    date: new Date("2023-03-01T10:00:00")
  }
  const outputLogin = await login.execute(inputLogin);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5NTgxODcwNTU1MiIsImlhdCI6MTY3NzY3NTYwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwMDB9.QjbcwNSsQNOD6XfnXhxkLAWLW0KfMywR9anWvxZ9soI'
  expect(outputLogin.token).toBe(token);
});

afterEach(async function () {
  await connection.close()
})