import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { useState } from "react";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { OneTimeIncome } from "../../../../backend/src/db/entities/OneTimeIncome.ts";
import { OneTimeIncomeBody } from "../../../../backend/src/db/types.ts";
import { Formik } from "formik";
import { CapAssetType, Recurrence } from "@/DoggrTypes.ts";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import {
	InputControl,
	RecurrenceSelector,
	SubmitButton,
} from "@/Components/FormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";
import { date, number, string } from "yup";

export const OneTimeIncomeForm = () => {
	function submitForm(event) {
		const toSubmit: OneTimeIncomeBody = {
			...event,
			owner_id: 3,
		};

		PostInputService.send("/oneTimeIncome", toSubmit)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	const oneTimeIncomeSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		cashBasis: number().positive().required(),
		date: date().default(null).required(),
		growthRate: number().required().positive().max(10),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
		fica: string().default(""),
	});

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={oneTimeIncomeSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					date: new Date().toISOString().slice(0, 10),
					cashBasis: 0,
					growthRate: 1,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create One Time Income</h1>
						</Row>
						<Row>
							<BaseInputForm
								handleChange={handleChange}
								valuesNote={values.note}
								valuesName={values.name}
								touchedNote={touched.note}
								touchedName={touched.name}
								errorsName={errors.name}
								errorsNote={errors.note}
								touchedGrowthRate={touched.growthRate}
								valuesGrowthRate={values.growthRate}
								errorsGrowth={errors.growthRate}
								type={"oneTimeIncome"}
							/>
							<InputControl
								handleChange={handleChange}
								name={"cashBasis"}
								type={"number"}
								values={values.cashBasis}
								touched={touched.cashBasis}
								errors={errors.cashBasis}
							/>
							<InputControl
								handleChange={handleChange}
								name={"date"}
								type={"date"}
								values={values.end}
								touched={touched.end}
								errors={errors.end}
							/>
							<TaxSelector
								level={"Federal"}
								stateChanger={handleChange}
								errors={errors.federal}
								touched={touched.federal}
								values={values.federal}
							/>
							<TaxSelector
								level={"State"}
								stateChanger={handleChange}
								errors={errors.state}
								touched={touched.state}
								values={values.state}
							/>
							<TaxSelector
								level={"Local"}
								stateChanger={handleChange}
								errors={errors.local}
								touched={touched.local}
								values={values.local}
							/>
							<TaxSelector
								level={"FICA"}
								stateChanger={handleChange}
								errors={errors.fica}
								touched={touched.fica}
								values={values.fica}
							/>
						</Row>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Create Income"} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
