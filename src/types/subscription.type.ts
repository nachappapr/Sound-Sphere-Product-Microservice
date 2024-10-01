export enum ProductEvent {
  PRODUCT_CREATED = "product_created",
  PRODUCT_UPDATED = "product_updated",
  PRODUCT_DELETED = "product_deleted",
}

export type ProductDataType = {
  id: string;
  title: string;
  price: number;
};

export enum ProductKafkaConfig {
  PRODUCT_TOPIC = "products",
  PRODUCT_GROUP = "products-service-group",
}

export interface ProductEventMessage {
  eventType: ProductEvent;
  data: any;
}
