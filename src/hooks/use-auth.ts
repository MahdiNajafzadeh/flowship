import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();
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

    const logout = useCallback(
        () =>
            api
                .post("/auth/logout")
                .then(() => reset())
                .then(() => navigate("/auth/login")),
        [reset, navigate],
    );

    return {
        login,
        logout,
        isSuccess,
        isPending,
        isError,
        error,
    };
}
