import { MessagePublisher } from "@soundspheree/common";
import { ITopicConfig } from "kafkajs";
import {
  ProductDataType,
  ProductEvent,
  ProductKafkaConfig,
} from "../../../types";

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
}
