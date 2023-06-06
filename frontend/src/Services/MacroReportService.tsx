import { httpClient } from "@/Services/HttpClient.tsx";

export const MacroReportService = {
	async send(id: number, end: Date) {
		const output = await httpClient.request({
			method: `search`,
			url: "/macroReport",
			data: { id, end: end.toString() },
		});
		return output;
	},
};
