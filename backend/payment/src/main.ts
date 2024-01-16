import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import Registry from './infra/dependency-injection/Registry';
import ProcessPayment from './application/usecase/Login';
import RabbitMQAdapter from './infra/queue/RabbitMQAdapter';
import QueueController from './infra/controller/QueueController';

const connection = new PgPromiseAdapter();
const httpServer = new ExpressAdapter();
const registry = Registry.getInstance();
const queue = new RabbitMQAdapter();
const processPayment = new ProcessPayment(queue) 
registry.provide("processPayment", processPayment);


new MainController(httpServer);
new QueueController(queue);

httpServer.listen(3002);
