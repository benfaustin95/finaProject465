import { RFBaseForm } from "@/Components/PostFormSubComponents/RFBase.tsx";
import { useState } from "react";
import { PostInputService } from "@/Services/PostInputService.tsx";
import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as yup from "yup";
import { date, number, string } from "yup";
import { Formik } from "formik";
import { CapAssetType, Recurrence, RFBase } from "@/DoggrTypes.ts";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import {
	InputControl,
	RecurrenceSelector,
	SubmitButton,
} from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { CAssetBody, RFBaseBody } from "../../../../backend/src/db/backendTypes/createTypes.ts";

export const FinancialAssetForm = (props: {
	submitForm: any;
	finAsset?: RFBase;
	deleteItem?: any;
}) => {
	const { userId } = useAuth();
	const { submitForm, finAsset, deleteItem } = props;
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
		capitalGains: string().default(""),
		owner_id: number().default(userId),
	});

	return (
		<Formik
			validationSchema={financialAssetSchema}
			onSubmit={submitForm}
			initialValues={
				finAsset != undefined
					? {
							...finAsset,
					  }
					: {
							name: "",
							note: "",
							growthRate: 1,
							totalValue: 0,
							costBasis: 0,
							wPriority: 1,
							owner_id: userId,
							federal: "",
							state: "",
							local: "",
							capitalGains: "",
							fica: "",
					  }
			}>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<Form onSubmit={handleSubmit} className={"p-4"}>
					<Row className={"m-4 justify-content-center"}>
						<h1 className={"text-center"}>Create Financial Asset</h1>
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
							errors={errors.capitalGains}
							touched={touched.capitalGains}
							values={values.capitalGains}
						/>
					</Row>{" "}
					<Row className={"mb-4 d-flex flex-row justify-content-center"}>
						<Col className={"d-flex flex-row justify-content-center"}>
							{deleteItem != undefined ? (
								<Button className={"btn-lg mr-2"} onClick={() => deleteItem(finAsset.id)}>
									Delete
								</Button>
							) : null}
							<SubmitButton name={deleteItem != undefined ? "Edit Expense" : "Create Expense"} />
						</Col>
					</Row>
				</Form>
			)}
		</Formik>
	);
};
