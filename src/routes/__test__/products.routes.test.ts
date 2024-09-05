import request from "supertest";
import { app } from "../../app";
import { Product, type ProductAttrs } from "../../model/products.model";

type ProductPayloadType = Omit<ProductAttrs, "userId">;

const productPayload: ProductPayloadType = {
  title: "earphone",
  description: "earphone",
  category: "electronics",
  inventory_count: 10,
  imageUrl: "earphone.jpg",
  price: 10,
};

const createProduct = async (productAttrs: ProductPayloadType) => {
  const cookie = signin();
  return await request(app)
    .post("/api/products")
    .set("Cookie", cookie!)
    .send(productAttrs);
};

describe("create products", () => {
  it("should only be accessed if the user is signed in", async () => {
    await request(app).post("/api/products").send(productPayload).expect(401);
  });
  it("should return a status other than 401 if the user is signed in", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send(productPayload);
    expect(response.status).not.toEqual(401);
  });
  it("should return an error if an invalid title is provided", async () => {
    const cookie = global.signin();
    await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send({
        ...productPayload,
        title: "",
      })
      .expect(400);
  });
  it("should return an error if an invalid price is provided", async () => {
    const cookie = global.signin();
    await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send({
        ...productPayload,
        price: -10,
      })
      .expect(400);
  });
  it("should create a product with valid inputs", async () => {
    // add in a check to make sure a product was saved
    let products = await Product.find({});
    expect(products?.length).toEqual(0);

    const cookie = global.signin();

    await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send(productPayload)
      .expect(201);

    products = await Product.find({});
    expect(products?.length).toEqual(1);
  });
});

describe("Get products", () => {
  it("should return a 404 if the product is not found", async () => {
    await request(app)
      .get(`/api/products/665e84fc814156371c3df9b9`)
      .send()
      .expect(404);
  });

  it("should return the product if the product is found", async () => {
    const cookie = signin();
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send(productPayload)
      .expect(201);

    await request(app)
      .get(`/api/products/${response.body.data.id}`)
      .send()
      .expect(200);
  });
});

describe("Get all products", () => {
  it("should return a list of products", async () => {
    await createProduct({ ...productPayload, title: "ticket1", price: 10 });
    await createProduct({ ...productPayload, title: "ticket2", price: 20 });
    await createProduct({ ...productPayload, title: "ticket3", price: 30 });

    const response = await request(app).get("/api/products").send().expect(200);
    expect(response.body.data.length).toEqual(3);
  });
});

describe("Update products", () => {
  it("should return a 404 if the product is not found", async () => {
    const cookie = signin();
    await request(app)
      .put(`/api/products/665e84fc814156371c3df9b9`)
      .set("Cookie", cookie!)
      .send(productPayload)
      .expect(404);
  });

  it("should return a 401 if the user is not authenticated", async () => {
    const response = await createProduct(productPayload);

    await request(app)
      .put(`/api/products/${response.body.data.id}`)
      .send(productPayload)
      .expect(401);
  });

  it("should return a 401 if the user does not own the product", async () => {
    const response = await createProduct(productPayload);

    const cookie = signin();
    await request(app)
      .put(`/api/products/${response.body.data.id}`)
      .set("Cookie", cookie!)
      .send(productPayload)
      .expect(401);
  });

  it("should return a 400 if the user provides an invalid title or price", async () => {
    const cookie = signin();
    const response = await createProduct(productPayload);

    await request(app)
      .put(`/api/products/${response.body.data.id}`)
      .set("Cookie", cookie!)
      .send({ title: "", price: "" })
      .expect(400);
  });

  it("should update the product provided valid inputs", async () => {
    const cookie = signin();
    const response = await request(app)
      .post("/api/products")
      .set("Cookie", cookie!)
      .send(productPayload);

    const updatedProduct = await request(app)
      .put(`/api/products/${response.body.data.id}`)
      .set("Cookie", cookie!)
      .send({ ...productPayload, title: "product updated", price: 20 })
      .expect(200);

    expect(updatedProduct.body.data.title).toEqual("product updated");
  });
});
