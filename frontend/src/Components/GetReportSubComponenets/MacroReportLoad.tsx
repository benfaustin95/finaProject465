import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MacroReportService } from "@/Services/MacroReportService.tsx";
import { httpClient } from "@/Services/HttpClient.tsx";
import { MacroYear } from "@/Components/GetReportSubComponenets/MacroYear.tsx";
import { destructuredMacroYearReport, macroYearReport } from "../../../../backend/src/db/types.ts";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "@/Services/Auth.tsx";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { InputControl, SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";

export function ReportYearForm(props: { handleSubmit: any }) {
	const { handleSubmit } = props;
	const yearSchema = yup.object({
		end: yup.number().min(new Date().getFullYear()).max(2175),
	});

	return (
		<Formik
			validationSchema={yearSchema}
			onSubmit={handleSubmit}
			initialValues={{ end: new Date().getFullYear() }}>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<Form onSubmit={handleSubmit} className={"bg-light"}>
					<Row>
						<InputControl
							handleChange={handleChange}
							type={"number"}
							name={"end"}
							values={values.end}
							touched={touched.end}
							errors={errors.end}
						/>
						<Col>
							<Button type="submit">Load Report</Button>
						</Col>
					</Row>
				</Form>
			)}
		</Formik>
	);
}
export const MacroReportLoad = () => {
	const location = useLocation();

	const navigate = useNavigate();
	const { userId } = useAuth();
	const [macroReport, setMacroReport] = useState<destructuredMacroYearReport>();
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
			})
			.catch((err) => {
				console.log(err);
				navigate("/");
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
					<ReportYearForm handleSubmit={loadReport} />
				</Col>
			</Row>
			{macroReport != undefined ? report : null}
		</Container>
	);
};
