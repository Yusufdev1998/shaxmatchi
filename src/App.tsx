import {BrowserRouter, Route, Routes} from "react-router-dom";
import DebutList from "./pages/DebutList";
import DebutPractice from "./pages/DebutPractice";
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<DebutList/>}/>
                    <Route path="/practice/:debutId" element={<DebutPractice/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                    <Route path="/admin" element={<AdminDashboard/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}
