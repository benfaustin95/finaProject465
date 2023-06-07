import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { MacroYear } from "@/Components/MacroYear.tsx";
import { destructuredMacroYearReport, macroYearReport } from "../../../backend/src/db/types.ts";
import { Container } from "react-bootstrap";

export const MacroReportLoad = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { end } = location.state;
	const [macroReport, setMacroReport] = useState<destructuredMacroYearReport>();
	const loadReport = () => {
		MacroReportService.send(3, new Date("1/1/2105"))
			.then((res) => {
				if (res.status != 200) navigate("/");
				console.log(res);
				return res.data;
			})
			.then((res) => {
				console.log(res);
				setMacroReport(res);
			})
			.catch((err) => {
				console.log(err);
				navigate("/");
			});
	};

	useEffect(() => {
		void loadReport();
	}, []);

	const report = <MacroYear {...macroReport} />;
	return <>{report}</>;
};
