import * as yup from "yup";
import { Formik, useFormikContext } from "formik";
import Form from "react-bootstrap/Form";
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import React from "react";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";

export function ReportYearForm(props: { handleSubmit: any; status: boolean }) {
	const { handleSubmit } = props;
	const yearSchema = yup.object({
		end: yup.number().min(new Date().getUTCFullYear()).max(2175),
	});

	return (
		<Formik
			validationSchema={yearSchema}
			validateOnChange={false}
			validateOnBlur={false}
			onSubmit={handleSubmit}
			initialValues={{ end: new Date().getFullYear() }}>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<Form onSubmit={handleSubmit} className={"bg-light"}>
					<Row>
						<Col xs={4} className={"text-nowrap d-flex align-items-center mr-0"}>
							<Form.Label htmlFor={"end"} className={"text-center p-0 h-100 w-100"}>
								End Year:
							</Form.Label>
						</Col>
						<Col xs={4} className={"d-flex align-items-center"}>
							<Form.Control
								id={"end"}
								type={"number"}
								name={"end"}
								value={values.end}
								isValid={touched.end && !errors.end}
								isInvalid={!!errors.end}
								onChange={handleChange}
								className={"h-100"}
							/>
							<Form.Control.Feedback type={"invalid"}>{errors.end}</Form.Control.Feedback>
						</Col>
						<Col xs={4}>
							<Button type="submit">Load</Button>
							{status ? <div className={"text-red"}> Submit Failed </div> : null}
						</Col>
					</Row>
				</Form>
			)}
		</Formik>
	);
}
