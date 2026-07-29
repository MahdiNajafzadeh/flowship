import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { client } from "./lib/query";
import { ProtectedRoute } from "@/components/protected-route";
import { PageLoading } from "@/components/page-loading";

const MainLayout = lazy(() => import("@/layouts/main"));
const Home = lazy(() => import("@/layouts/main/pages/home"));
const LoginLayout = lazy(() => import("@/layouts/login"));
const NotFound = lazy(() => import("@/components/not-found-page"));

export default function App() {
    return (
        <QueryClientProvider client={client}>
            <BrowserRouter>
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<Home />} />
                            </Route>
                        </Route>
                        <Route path="/auth/login" element={<LoginLayout />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
