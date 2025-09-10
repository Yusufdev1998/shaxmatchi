import { Suspense, lazy } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const DebutList = lazy(() => import("./pages/DebutList"));
const DebutPractice = lazy(() => import("./pages/DebutPractice"));
const SignIn = lazy(() => import("./pages/SignIn"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminDebuts = lazy(() => import("./pages/AdminDebuts"));

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
                <Suspense fallback={<div className="p-6 text-center">Yuklanmoqda...</div>}>
                    <Routes>
                        <Route path="/" element={<DebutList/>}/>
                        <Route path="/practice/:debutId" element={<DebutPractice/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                        <Route path="/admin/debuts" element={<AdminDebuts/>}/>
                    </Routes>
                </Suspense>
            </div>
        </BrowserRouter>
    );
}
