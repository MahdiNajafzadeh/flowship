import { NoSuchModelError } from "@ai-sdk/provider";
import type {
	DigitalEmployeesProvider,
	DigitalEmployeesProviderSettings,
	DigitalEmployeesChatSettings,
} from "./digital-employees-types";
import { DigitalEmployeesChatLanguageModel } from "./digital-employees-chat-language-model";

export function createDigitalEmployees(
	options: DigitalEmployeesProviderSettings = {},
): DigitalEmployeesProvider {
	const baseURL = options.baseURL ?? "/api/chat/completion";

	const createChatModel = (
		modelId: string,
		settings: DigitalEmployeesChatSettings = {},
	) =>
		new DigitalEmployeesChatLanguageModel(modelId, settings, {
			provider: "digital-employees",
			baseURL,
			headers: () => ({ ...options.headers }),
			fetch: options.fetch,
		});

	const provider = Object.assign(
		(modelId: string, settings?: DigitalEmployeesChatSettings) =>
			createChatModel(modelId, settings),
		{
			specificationVersion: "v4" as const,
			languageModel: createChatModel,
			embeddingModel: () => {
				throw new NoSuchModelError({
					modelId: "",
					modelType: "embeddingModel",
					message:
						"Digital Employees provider does not support embedding models",
				});
			},
			imageModel: () => {
				throw new NoSuchModelError({
					modelId: "",
					modelType: "imageModel",
					message:
						"Digital Employees provider does not support image models",
				});
			},
		},
	);

	return provider as unknown as DigitalEmployeesProvider;
}
