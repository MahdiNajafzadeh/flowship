import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/main";
import Home from "@/layouts/main/pages/home";
import Users from "@/layouts/main/pages/users";
import Settings from "@/layouts/main/pages/settings";
import LoginLayout from "@/layouts/login";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/auth/login" element={<LoginLayout />} />
            </Routes>
        </BrowserRouter>
    );
}
