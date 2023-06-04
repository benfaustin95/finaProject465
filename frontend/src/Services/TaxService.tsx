import { httpClient } from "@/Services/HttpClient.tsx";

export const TaxService = {
	async send(level: string) {
		const toReturn = await httpClient.get(`/taxRate/${level}`);
		return toReturn;
	},
};
