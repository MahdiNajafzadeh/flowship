import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import { ImageDithering } from "@paper-design/shaders-react";
import { Suspense } from "react";

const imageList = Object.keys(import.meta.glob("../../../public/img/*", { eager: true }));
const getImageRandom = () => imageList[Math.floor(imageList.length * Math.random())].replaceAll("../../../public", "");
const AsyncShader = async () => (
    <ImageDithering
        image={getImageRandom()}
        className="size-full"
        colorBack="#000000"
        colorFront="#ffffff"
        colorHighlight="#ffffff"
        originalColors
        inverted={false}
        type="8x8"
        size={5}
        colorSteps={5}
        fit="cover"
    />
);

export function Shader(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className={cn(props.className, "flex justify-center items-center")}>
            <Suspense fallback={<span className="shimmer shimmer-color-white text-muted-foreground">Loading</span>}>
                <AsyncShader />
            </Suspense>
        </div>
    );
}

export default function Login(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} className={cn(props.className, "w-screen h-screen flex")}>
            <Shader className="w-1/2 h-full" />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
