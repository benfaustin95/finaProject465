import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MicroReportService } from "@/Services/MicroReportService.tsx";
import { MicroYear } from "@/Components/GetReportSubComponenets/MicroReportComponents/MicroYear.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { DestructuredMicroReport } from "../../../../destructureTypes.ts";

export const MicroReportLoad = () => {
	const navigate = useNavigate();
	const { userId } = useAuth();
	// const { end } = location.state;
	const [microReport, setMicroReport] = useState<DestructuredMicroReport>();
	const loadReport = () => {
		MicroReportService.send(userId)
			.then((res) => {
				if (res.status != 200) navigate("/");
				return res.data;
			})
			.then((res) => {
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
