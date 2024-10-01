import { MessageConsumer } from "@soundspheree/common";
import { ProductEvent, ProductKafkaConfig } from "../../../types";

export class ProductConsumer extends MessageConsumer<
  ProductKafkaConfig.PRODUCT_GROUP,
  ProductKafkaConfig.PRODUCT_TOPIC,
  ProductEvent.PRODUCT_CREATED,
  { id: string; title: string }
> {
  protected topic: ProductKafkaConfig.PRODUCT_TOPIC =
    ProductKafkaConfig.PRODUCT_TOPIC;
  protected groupId: ProductKafkaConfig.PRODUCT_GROUP =
    ProductKafkaConfig.PRODUCT_GROUP;
}
