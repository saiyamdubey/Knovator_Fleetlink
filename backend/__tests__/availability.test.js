const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../src/index");
const Vehicle = require("../src/models/Vehicle");
const Booking = require("../src/models/Booking");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Vehicle.deleteMany();
  await Booking.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test("should create vehicle", async () => {
  const res = await request(app)
    .post("/api/vehicles")
    .send({ name: "Truck A", capacityKg: 1000, tyres: 6 });

  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe("Truck A");
});

test("should not allow overlapping booking", async () => {
  const vehicle = await Vehicle.create({ name: "Van", capacityKg: 500, tyres: 4 });

  // First booking
  await request(app).post("/api/bookings").send({
    vehicleId: vehicle._id,
    fromPincode: "110001",
    toPincode: "110010",
    startTime: new Date().toISOString(),
    customerId: "CUST1"
  });

  // Second booking with same time → should conflict
  const res2 = await request(app).post("/api/bookings").send({
    vehicleId: vehicle._id,
    fromPincode: "110001",
    toPincode: "110010",
    startTime: new Date().toISOString(),
    customerId: "CUST2"
  });

  expect(res2.statusCode).toBe(409);
});
