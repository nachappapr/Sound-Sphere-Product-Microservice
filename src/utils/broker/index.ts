import {
  connectConsumer,
  connectProducer,
  logger,
  subscribe,
} from "@soundspheree/common";

import { type Consumer, type Producer } from "kafkajs";
import { ProductKafkaConfig } from "../../types";

export const initiateBroker = async () => {
  // connect to kafka producer
  const client = await connectProducer<
    Producer,
    ProductKafkaConfig.PRODUCT_TOPIC
  >([ProductKafkaConfig.PRODUCT_TOPIC]);
  client.on("producer.connect", async () => {
    logger.info("Connected to Kafka Producer");
  });
  client.on("producer.disconnect", async () => {
    logger.info("Disconnected from Kafka Producer");
  });
};

export const initiateConsumer = async () => {
  // consumer from kafka
  const consumer = await connectConsumer<Consumer>(
    ProductKafkaConfig.PRODUCT_TOPIC
  );
  consumer.on("consumer.connect", async () => {
    logger.info("Connected to Kafka Consumer");
  });

  await subscribe(
    async (message) => {
      console.log(message, "messagea");
    },
    ProductKafkaConfig.PRODUCT_TOPIC,
    ProductKafkaConfig.PRODUCT_GROUP
  );
};
