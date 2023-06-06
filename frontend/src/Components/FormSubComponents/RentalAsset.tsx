import { useState } from "react";
import { RentalAssetBody, RFBaseBody } from "../../../../backend/src/db/types.ts";
import { PostInputService } from "@/Services/PostInputService.tsx";
import Form from "react-bootstrap/Form";
import { RFBaseForm } from "@/Components/FormSubComponents/RFBase.tsx";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as yup from "yup";
import { number, string } from "yup";
import { Formik } from "formik";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { InputControl, SubmitButton } from "@/Components/FormSubComponents/CapAssetForm.tsx";

export const RentalAssetForm = () => {
	function submitForm(event) {
		const toSubmit = {
			...event,
			owner_id: 3,
		};
		PostInputService.send("/financialAsset", toSubmit)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const financialAssetSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		growthRate: number().required().positive().max(10),
		totalValue: number().required().positive(),
		costBasis: number().required().min(0),
		wPriority: number().required().integer().positive(),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
		fica: string().default(""),
		capitalgains: string().default(""),
		owed: number().required().min(0),
		expense: number().required().min(0),
		grossIncome: number().min(0).required(),
	});

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-50"}>
			<Formik
				validationSchema={financialAssetSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					growthRate: 1,
					totalValue: 0,
					costBasis: 0,
					wPriority: 1,
					owed: 0,
					expense: 0,
					grossIncome: 0,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Rental Asset</h1>
						</Row>
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
							type={"financialAsset"}
						/>
						<RFBaseForm
							handleChange={handleChange}
							errorsTotalValue={errors.totalValue}
							touchedTotalValue={touched.totalValue}
							valuesTotalValue={values.totalValue}
							errorsCostBasis={errors.costBasis}
							touchedCostBasis={touched.costBasis}
							valuesCostBasis={values.costBasis}
							errorsWPriority={errors.wPriority}
							valuesWPriority={values.wPriority}
							touchedWPriority={touched.wPriority}
						/>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"owed"}
								values={values.owed}
								touched={touched.owed}
								errors={errors.owed}
							/>
						</Row>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"expense"}
								values={values.expense}
								touched={touched.expense}
								errors={errors.expense}
							/>
						</Row>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"grossIncome"}
								values={values.grossIncome}
								touched={touched.grossIncome}
								errors={errors.grossIncome}
							/>
						</Row>
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
						<TaxSelector
							level={"capitalgains"}
							stateChanger={handleChange}
							errors={errors.capitalgains}
							touched={touched.capitalgains}
							values={values.capitalgains}
						/>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Create Asset"} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
