import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
		proxy: {
			"/api/chat/completion": {
				target: "https://aistudio-test.partcorp.ir/api/v1/digital-employees/chat/completions",
				changeOrigin: true,
				rewrite: (v) => v.replace(/\/api\/chat\/completion/, ""),
				configure: (proxy, _options) => {
					proxy.on("proxyReq", (proxyReq) => {
						console.log(`< ${proxyReq.method} ${proxyReq.path}`);
						proxyReq.setHeader(
							"X-API-KEY",
							"sk-xVdzUjVAnIaNLEeBm0iRdOBca7jj0iSCB5AGR4f2T70",
						);
					});
					proxy.on("proxyRes", (proxyReq, req, res) => {
						console.log(
							`> ${proxyReq.method} ${proxyReq.path} ${res.statusCode}`,
						);
					});
				},
			},
		},
	},
});
