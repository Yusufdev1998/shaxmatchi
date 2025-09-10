import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

interface NavBarProps {
    title: string;
}

export default function NavBar({title}: NavBarProps) {
    const {user, loading,} = useAuth();
    const navigate = useNavigate();

    const goSignIn = () => navigate("/signin");
    const goBack = () => navigate(-1);
    return (
        <div className="w-full flex justify-between items-center p-4 bg-blue-600 text-white">
            <button onClick={goBack} className="text-sm font-medium">⬅ Orqaga</button>
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Shaxmatchi logo" className="w-6 h-6"/>
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                {!user ? (
                    <button onClick={goSignIn} disabled={loading}
                            className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded">
                        {loading ? "Yuklanmoqda..." : "Kirish"}
                    </button>
                ) : (
                    <Link to="/admin" className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded">
                        Admin
                    </Link>
                )}
            </div>
        </div>
    );
}
