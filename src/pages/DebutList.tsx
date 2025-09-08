import {Link} from "react-router-dom";
import {type Debut, debuts} from "../data/debuts";

export default function DebutList() {
    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center mb-4">Choose a Debut</h1>
            <ul className="flex flex-col gap-3">
                {debuts.map((debut: Debut) => (
                    <Link
                        key={debut.id}
                        to={`/practice/${debut.id}`}
                        className="p-4 bg-white rounded-xl shadow text-center font-medium hover:bg-blue-100"
                    >
                        {debut.name}
                    </Link>
                ))}
            </ul>
        </div>
    );
}
