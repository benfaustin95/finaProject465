import { httpClient } from "@/Services/HttpClient.tsx";

export const MicroReportService = {
	async send(id: number) {
		const output = await httpClient.request({
			method: `search`,
			url: "/microReport",
			data: { id },
		});
		return output;
	},
};
