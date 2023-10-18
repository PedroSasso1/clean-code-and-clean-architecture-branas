import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import AccountDAODatabase from './infra/repository/AccountDAODatabase';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RequestRide from './application/usecase/RequestRide';
import RideDAODatabase from './infra/repository/RideDAODatabase';
import GetRide from './application/usecase/GetRide';

const connection = new PgPromiseAdapter();
const rideDAO = new RideDAODatabase(connection)
const accountDAO = new AccountDAODatabase(connection);
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const requestRide = new RequestRide(rideDAO, accountDAO)
const getRide = new GetRide(rideDAO, accountDAO);
const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount, requestRide, getRide)
httpServer.listen(3000)
