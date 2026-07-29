import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const { login, isSuccess, isPending, isError, error } = useAuth();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    if (isSuccess) return <Navigate to={redirectTo} />;
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} action={login}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                {isError && (
                    <Alert variant="destructive" className="max-w-md">
                        <AlertCircleIcon />
                        <AlertTitle>Error Title</AlertTitle>
                        <AlertDescription>{String(error)}</AlertDescription>
                    </Alert>
                )}
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" name="username" type="text" required />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input id="password" name="password" type="password" required />
                </Field>
                <Field>
                    <Button disabled={isPending} type="submit">
                        Login
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
