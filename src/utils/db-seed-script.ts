import { faker } from "@faker-js/faker";
import { Product, ProductAttrs } from "../model/products.model";
import { logger } from "@soundspheree/common";

export const productList = () => {
  const products: ProductAttrs[] = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      title: faker.commerce.productName(),
      price: parseInt(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      inventory_count: 1,
      imageUrl: faker.image.url(),
      userId: faker.string.uuid(),
    });
  }
  return products;
};

export const seedDatabase = async () => {
  try {
    const products = productList();
    await Product.insertMany(products);
    logger.info("Products seeded successfully");
  } catch (error) {
    logger.error("Error seeding products", error);
  }
};
