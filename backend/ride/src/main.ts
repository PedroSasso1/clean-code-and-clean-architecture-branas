import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RequestRide from './application/usecase/RequestRide';
import GetRide from './application/usecase/GetRide';
import RepositoryDatabaseFactory from './infra/factory/RepositoryDatabaseFactory';
import Registry from './infra/dependency-injection/Registry';
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp';
import AxiosAdapter from './infra/http/AxiosAdapter';

const connection = new PgPromiseAdapter();
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const httpServer = new ExpressAdapter();
const accountGateway = new AccountGatewayHttp(new AxiosAdapter());
const registry = Registry.getInstance();
registry.provide("requestRide", new RequestRide(repositoryFactory, accountGateway));
registry.provide("getRide", new GetRide(repositoryFactory, accountGateway));

new MainController(httpServer)
httpServer.listen(3001)
