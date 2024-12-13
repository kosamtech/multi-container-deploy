import * as redis from "redis";
import { keys } from "./keys";

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

const sub = redisClient.duplicate();

function fib(index: number): number {
    if (index < 2) return 1;
    let a = 1,
        b = 1;
    for (let i = 2; i <= index; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

async function establishConnection() {
    try {
        await redisClient.connect();
        await sub.connect();
        console.log("Redis connected and ready to receive events");

        sub.subscribe("insert", (message) => {
            console.log("Message received:", message);
            const index = parseInt(message);
            console.log("index", 4);

            try {
                const value = fib(index);
                console.log("fib value", value);
                redisClient.hSet("values", message, value);
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}

establishConnection();

process.on("SIGINT", async () => {
    console.log("Disconnecting Redis...");
    await sub.disconnect();
    await redisClient.disconnect();
    process.exit(0);
});
