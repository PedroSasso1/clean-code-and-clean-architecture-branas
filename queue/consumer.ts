import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  channel.assertQueue("test", { durable: true });
  channel.consume("test", function (msg) {
    if (!msg) return null;
    console.log(msg.content.toString());
    channel.ack(msg);
  });
}

main();
