const mockProducer = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  send: jest.fn(),
};

const mockConsumer = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  subscribe: jest.fn(),
  run: jest.fn(),
};

const Kafka = jest.fn(() => ({
  producer: jest.fn(() => mockProducer),
  consumer: jest.fn(() => mockConsumer),
}));

export { Kafka, mockProducer, mockConsumer };
