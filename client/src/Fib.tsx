import { FC, FormEvent, useEffect, useState } from "react";
import axios from "axios";

interface SeenIndexes {
    id: number;
    value: number;
}

interface CurrentValue {
    [key: string]: string;
}

const Fib: FC = () => {
    const [seenIndexes, setSeenIndexes] = useState<SeenIndexes[]>([]);
    const [values, setValues] = useState<CurrentValue>({});
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        fetchValues();
        fetchIndexes();
    }, []);

    const fetchValues = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/values/current`,
        );
        setValues(res.data);
    };

    const fetchIndexes = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/values/all`,
        );
        setSeenIndexes(res.data);
    };

    const handleSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        await axios.post(
            `${import.meta.env.VITE_API_URL}"/api/values"`,
            { index: index },
            { headers: { "Content-Type": "application/json" } },
        );
        setIndex(0);
        window.location.reload();
    };

    const renderSeenIndexes = () =>
        seenIndexes.map((sI) => sI.value).join(", ");

    const renderValues = () => {
        const entries = [];

        for (let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {values[key]}
                </div>,
            );
        }
        return entries;
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Enter your index:</label>
                <input
                    value={index}
                    onChange={(ev) => setIndex(parseInt(ev.target.value))}
                />
                <button style={{ marginLeft: "10px" }}>Submit</button>
            </form>

            <h3>Indexes I have seen:</h3>
            {renderSeenIndexes()}

            <h3>Calculated Values:</h3>
            {renderValues()}
        </div>
    );
};

export default Fib;
