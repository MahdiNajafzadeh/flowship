import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";

export type Profile = {
    id: number;
    name: string;
    role: number;
    createdAt: string;
    updatedAt: string;
};
export function useProfile() {
    const { data, isSuccess, isLoading, isError, error } = useQuery<void, HTTPError, Profile>({
        queryKey: ["profile"],
        queryFn: () => api.get("/profile").json(),
    });
    return {
        profile: data,
        isSuccess,
        isLoading,
        isError,
        error,
    };
}
