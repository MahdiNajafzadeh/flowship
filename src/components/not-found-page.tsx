import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-3 mt-2">
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
                <Link to="/auth/login">
                    <Button variant="outline">Login</Button>
                </Link>
            </div>
        </div>
    );
}
