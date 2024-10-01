import { Kafka } from "kafkajs";

const clientId = process.env.KAFKA_CLIENT_ID!;
const brokers = process.env.KAFKA_BROKERS?.split(",")!;

class KafkaWrapper {
  constructor(protected client: Kafka) {}
  getClient() {
    return this.client;
  }
}

const client = new Kafka({
  brokers,
  clientId,
});

export const kafkaClient = new KafkaWrapper(client).getClient();
