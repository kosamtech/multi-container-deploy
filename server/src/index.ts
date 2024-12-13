import express from "express";
import cors from "cors";
import { Pool } from "pg";
import * as redis from "redis";
import { keys } from "./keys";

const app = express();
app.use(cors());
app.use(express.json());

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
});

pgClient.on("connect", (client) => {
    client
        .query(
            "CREATE TABLE IF NOT EXISTS fibvalues (id SERIAL PRIMARY KEY, value INT)",
        )
        .then((result) => console.log(result))
        .catch((reason) => console.log(reason));
    console.log("database connected!");
});

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
});
const redisPublisher = redisClient.duplicate();

(async () => {
    await redisClient.connect();
    await redisPublisher.connect();
})();

app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/api/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * from fibvalues");
    res.status(200).json(values.rows);
});

app.get("/api/values/current", async (req, res) => {
    const values = await redisClient.hGetAll("values");
    res.status(200).json(values);
});

app.post("/api/values", async (req, res) => {
    const index = req.body.index;
    console.log("index from post", index)

    if (parseInt(index) > 40) {
        res.status(422).json({message: "Index too high"});
        return;
    }

    await redisClient.hSet("values", index, "Nothing yet!");
    await redisPublisher.publish("insert", String(index));
    pgClient.query("INSERT INTO fibvalues(value) VALUES($1)", [index]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log("Server listening on port 5000");
});
