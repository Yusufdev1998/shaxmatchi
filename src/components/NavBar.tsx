import {Link} from "react-router-dom";

interface NavBarProps {
    title: string;
}

export default function NavBar({title}: NavBarProps) {
    return (
        <div className="w-full flex justify-between items-center p-4 bg-blue-600 text-white">
            <Link to="/" className="text-sm font-medium">⬅ Back</Link>
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="w-12"></div>
            {/* spacer */}
        </div>
    );
}
