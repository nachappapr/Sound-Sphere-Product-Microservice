import { logger } from "@soundspheree/common";
import cron from "node-cron";
import { ProductCreatedProducer } from "../message-broker/events/publisher/product-created-publisher";
import { kafkaClient } from "../message-broker/kakfa-wrapper";
import { EventModel } from "../model/events.model";
import { ProductDataType, ProductEvent, ProductKafkaConfig } from "../types";

const publishFailedEvents = async () => {
  try {
    const events = await EventModel.find({
      status: "failed",
    });

    for (const event of events) {
      try {
        await new ProductCreatedProducer(kafkaClient).publish({
          event: event.event as ProductEvent.PRODUCT_CREATED,
          topic: event.topic as ProductKafkaConfig.PRODUCT_TOPIC,
          message: event.message as ProductDataType,
        });
        event.status = "success";
        await event.save();
      } catch (error) {
        logger.error("Error publishing failed event:", error);
      }
    }
  } catch (error) {
    logger.error("Error fetching failed events:", error);
  }
};

// Schedule the cron job to run every minute
cron.schedule("* * * * *", publishFailedEvents);
