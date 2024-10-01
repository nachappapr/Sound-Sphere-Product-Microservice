import { ITopicConfig } from "kafkajs";
import { MessagePublisher } from "@soundspheree/common";
import {
  ProductDataType,
  ProductEvent,
  ProductKafkaConfig,
} from "../types/subscription.type";

type TopicType = ProductKafkaConfig.PRODUCT_TOPIC;
type CreateProductType = ProductEvent.PRODUCT_CREATED;

export class ProductCreatedProducer extends MessagePublisher<
  TopicType,
  CreateProductType,
  ProductDataType
> {
  protected topic: TopicType[] = [ProductKafkaConfig.PRODUCT_TOPIC];
  protected topicConfig?: Omit<ITopicConfig, "topic"> = {
    numPartitions: 3,
  };

  publish = jest.fn().mockResolvedValue(true);
}
