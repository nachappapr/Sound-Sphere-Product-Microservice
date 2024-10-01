import { ITopicConfig } from "kafkajs";
import { MessagePublisher } from "@soundspheree/common";
import {
  ProductDataType,
  ProductEvent,
  ProductKafkaConfig,
} from "../../../types";

type TopicType = ProductKafkaConfig.PRODUCT_TOPIC;
type CreateProductType = ProductEvent.PRODUCT_UPDATED;

export class ProductUpdatedPublisher extends MessagePublisher<
  TopicType,
  CreateProductType,
  ProductDataType
> {
  protected topic: TopicType[] = [ProductKafkaConfig.PRODUCT_TOPIC];
  protected topicConfig?: Omit<ITopicConfig, "topic"> = {
    numPartitions: 3,
  };
}
