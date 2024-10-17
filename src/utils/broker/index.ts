import { connectConsumer, logger, subscribe } from "@soundspheree/common";
import { type Consumer } from "kafkajs";
import { ProductKafkaConfig } from "../../types";

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
      console.log(message);
    },
    ProductKafkaConfig.PRODUCT_TOPIC,
    ProductKafkaConfig.PRODUCT_GROUP
  );
};
