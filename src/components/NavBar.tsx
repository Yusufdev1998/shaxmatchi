import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavBarProps {
    title: string;
}

export default function NavBar({title}: NavBarProps) {
    const { user, signOutUser } = useAuth();
    const navigate = useNavigate();

    const goSignIn = () => navigate("/signin");

    return (
        <div className="w-full flex justify-between items-center p-4 bg-blue-600 text-white">
            <Link to="/" className="text-sm font-medium">⬅ Back</Link>
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="flex items-center gap-3">
                {user && (
                    <Link to="/admin" className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded">
                        Admin
                    </Link>
                )}
                {!user ? (
                    <button onClick={goSignIn} className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded">
                        Sign In
                    </button>
                ) : (
                    <button onClick={() => void signOutUser()} title={user.displayName ?? "Account"} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full bg-white text-blue-600 flex items-center justify-center font-bold">
                                {(user.displayName?.[0] ?? "U").toUpperCase()}
                            </div>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
