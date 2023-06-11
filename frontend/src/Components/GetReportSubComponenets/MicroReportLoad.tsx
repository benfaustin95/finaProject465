import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { MacroYear } from "@/Components/GetReportSubComponenets/MacroYear.tsx";
import { MacroReport } from "../../../../backend/src/db/backendTypes/ReportTypes.ts";
import { MicroReportService } from "@/Services/MicroReportService.tsx";
import { MicroYear } from "@/Components/GetReportSubComponenets/MicroYear.tsx";
import { Container } from "react-bootstrap";
import { useAuth } from "@/Services/Auth.tsx";
import {
	DestructuredMacroReport,
	DestructuredMicroReport,
} from "../../../../backend/src/db/backendTypes/destructureTypes.ts";

export const MicroReportLoad = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { userId } = useAuth();
	// const { end } = location.state;
	const [microReport, setMicroReport] = useState<DestructuredMicroReport>();
	const loadReport = () => {
		MicroReportService.send(userId)
			.then((res) => {
				console.log(res.request.headers);
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
