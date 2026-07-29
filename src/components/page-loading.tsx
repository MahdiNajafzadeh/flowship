import { Spinner } from "@/components/ui/spinner";

export function PageLoading() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Spinner className="size-8" />
        </div>
    );
}
