import React from "react";
import NavBar from "../components/NavBar";
import {useAuth} from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";

export default function AdminDashboard() {
    const {user, loading, signOutUser} = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !user) {
            navigate("/", {replace: true});
        }
    }, [loading, user, navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar title="Admin paneli"/>
            <div className="p-4 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Xush
                        kelibsiz{user?.displayName ? ", " + user.displayName : ""}!</h2>
                    <p className="text-gray-600 mb-4">Kontentni boshqarish uchun quyidagi vositalardan foydalaning.</p>
                    <div className="flex flex-wrap gap-3  flex-col justify-between">
                        <button onClick={() => navigate('/admin/debuts')}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Debyutlar
                        </button>
                        <button onClick={async () => {
                            await signOutUser();
                            navigate('/');
                        }} className="px-4 py-2 bg-red-500 text-white rounded border">Tizimdan chiqish
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
