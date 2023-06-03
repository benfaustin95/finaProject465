import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { MacroYear } from "@/Components/MacroYear.tsx";
import {
	destructuredMacroYearReport,
	destructuredMicroReport,
	macroYearReport,
} from "../../../backend/src/db/types.ts";
import { MicroReportService } from "@/Services/MicroReportService.tsx";
import { MicroYear } from "@/Components/MicroYear.tsx";

export const MicroReportLoad = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// const { end } = location.state;
	const [microReport, setMicroReport] = useState<destructuredMicroReport>();
	const loadReport = () => {
		MicroReportService.send(1)
			.then((res) => {
				if (res.status != 200) navigate("/");
				console.log(res);
				return res.data;
			})
			.then((res) => {
				console.log(res);
				setMicroReport(res);
			})
			.catch((err) => {
				console.log(err);
				navigate("/");
			});
	};

	useEffect(() => {
		void loadReport();
	}, []);

	const report = <MicroYear {...microReport} />;
	return <>{report}</>;
};
