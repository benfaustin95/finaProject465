import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { MacroYear } from "@/Components/GetReportSubComponenets/MacroReportComponents/MacroYear.tsx";
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "@/Services/Auth.tsx";
import { DestructuredMacroReport } from "destructureTypes.ts";
import { ReportYearForm } from "@/Components/GetReportSubComponenets/MacroReportComponents/ReportYearForm.tsx";

export const MacroReportLoad = () => {
	const navigate = useNavigate();
	const { userId, handleToken } = useAuth();
	const [macroReport, setMacroReport] = useState<DestructuredMacroReport>();
	const [submitFailed, setSubmitFailed] = useState(false);
	const loadReport = (event) => {
		MacroReportService.send(userId, event.end)
			.then((res) => {
				if (res.status != 200) navigate("/");
				console.log(res);
				return res.data;
			})
			.then((res) => {
				console.log(res);
				setMacroReport(res);
				setSubmitFailed(false);
			})
			.catch((err) => {
				console.log(err);
				setSubmitFailed(true);
			});
	};

	const report = <MacroYear {...macroReport} />;
	return (
		<Container className={"bg-light rounded-4 m-5 p-5"}>
			<Row className={"text-center pb-4"}>
				<Col xs={8}>
					<h1>Yearly Budget Estimate</h1>
				</Col>
				<Col xs={4}>
					<ReportYearForm handleSubmit={loadReport} status={submitFailed} />
				</Col>
			</Row>
			{macroReport != undefined && macroReport.withdrawals.remainder.note != "" ? (
				<div
					className={" text-center m-2 p-2 h5 border border-danger border-4 rounded text-danger"}>
					{"WIll RUN OUT OF MONEY IN " + JSON.parse(macroReport.withdrawals.remainder.note).year}
				</div>
			) : null}
			{macroReport != undefined ? report : null}
		</Container>
	);
};
