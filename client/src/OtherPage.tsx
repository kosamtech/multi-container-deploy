import { FC } from "react";
import { Link } from "react-router-dom";

const OtherPage: FC = () => {
    return (
        <div>
            <p>I'm some other page!</p>
            <Link to={"/"}>Go back home</Link>
        </div>
    );
};

export default OtherPage;
