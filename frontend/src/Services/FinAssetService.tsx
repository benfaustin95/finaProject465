import { httpClient } from "@/Services/HttpClient.tsx";

export const FinAssetService = {
	async send(id: number) {
		const toReturn = await httpClient({
			method: "search",
			url: `/financialAsset`,
			data: { userId: id },
		});
		return toReturn;
	},
};
