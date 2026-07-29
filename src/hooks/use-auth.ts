import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useCallback } from "react";

export function useAuth() {
    const {
        mutate: loginMutate,
        isSuccess,
        isPending,
        isError,
        error,
        reset,
    } = useMutation<unknown, HTTPError, FormData>({
        mutationFn: (data: FormData) =>
            api.post("/auth/login", { json: { username: data.get("username"), password: data.get("password") } }),
        onError: console.log,
    });

    const login = useCallback(
        (formData: FormData) => {
            reset();
            loginMutate(formData);
        },
        [loginMutate, reset],
    );

    const logout = useCallback(async () => {
        await api.post("/auth/logout");
        reset();
    }, [reset]);

    return {
        login,
        logout,
        isSuccess,
        isPending,
        isError,
        error,
    };
}
