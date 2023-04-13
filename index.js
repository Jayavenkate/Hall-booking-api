import * as dotenv from 'dotenv' 
dotenv.config()
import express from "express";
import { MongoClient } from "mongodb";
const app = express();
// console.log(process.env.MONGO_URL);

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
// const MONGO_URL = "mongodb://127.0.0.1";

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩B42WD2");
});
// create room
app.post("/createroom", express.json(),async function (request, response) {
  const {id, seats, amentities, price } = request.body;
  const result = await client
    .db("b42wd2")
    .collection("rooms")
    .insertOne({
      id: id,
      seats:seats ,
      amentities: amentities,
      price: price,
    });
  result
    ? response.send({ message: "room created successfully" })
    : response.status(404).send({ message: "not found" });
});
//room booking
app.post("/roombooking", express.json(), async function (request, response) {
  const { name, date, start, end, roomId } = request.body;
  const result = await client.db("b42wd2").collection("rooms").insertOne({
    name: name,
    date: date,
    start: start,
    end: end,
    roomId: roomId,
  });
  result
    ? response.send({ message: "room booking successfully" })
    : response.status(401).send({ message: "error occured" });
});

//list all rooms with booked data
app.get("/bookedrooms", async function (request, response) {
  const result = await client.db("b42wd2").collection("rooms").find({}).toArray();
  response.send(result);
});
//list all customers with booked data
app.get("/customers", async function (request, response) {
  const result = await client.db("b42wd2").collection("rooms").find({},{status:0}).toArray();
  response.send(result);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
