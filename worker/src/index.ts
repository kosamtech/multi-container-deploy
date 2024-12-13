import * as redis from "redis";
import { keys } from "./keys";

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
});

const sub = redisClient.duplicate();

function fib(index: number): number {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

(async () => {
    await redisClient.connect();
    await sub.connect();

    sub.subscribe("insert", (message) => {
        redisClient.hSet("value", message, fib(parseInt(message)));
    });
})();
