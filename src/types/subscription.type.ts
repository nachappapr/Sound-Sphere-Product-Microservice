export enum ProductEvent {
  PRODUCT_CREATED = "product_created",
  PRODUCT_UPDATED = "product_updated",
  PRODUCT_DELETED = "product_deleted",
}

export enum ProductKafkaConfig {
  PRODUCT_TOPIC = "product_events",
  PRODUCT_GROUP = "products-service-group",
}
