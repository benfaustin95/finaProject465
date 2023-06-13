import Form from "react-bootstrap/Form";
import { RFBaseForm } from "@/Components/PostFormSubComponents/RFBase.tsx";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as yup from "yup";
import { number, string } from "yup";
import { Formik } from "formik";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { getTax, RentalAsset, RouteTypes } from "@/DoggrTypes.ts";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";

export const RentalAssetForm = (props: {
	submitForm: any;
	rentalAsset?: RentalAsset;
	deleteItem?: any;
}) => {
	const { userId } = useAuth();
	const { submitForm, rentalAsset, deleteItem } = props;

	const rentalAssetSchema = yup.object().shape({
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
		owed: number().required().min(0),
		maintenanceExpense: number().required().min(0),
		grossIncome: number().min(0).required(),
		owner_id: number().default(userId),
	});

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={rentalAssetSchema}
				onSubmit={submitForm}
				initialValues={
					rentalAsset != undefined
						? {
								name: rentalAsset.name,
								note: rentalAsset.note,
								growthRate: Math.round((rentalAsset.growthRate - 1) * 100),
								costBasis: rentalAsset.costBasis,
								wPriority: rentalAsset.wPriority,
								owed: rentalAsset.owed,
								maintenanceExpense: rentalAsset.maintenanceExpense,
								grossIncome: rentalAsset.grossIncome,
								owner_id: userId,
								id: rentalAsset.id,
								...getTax(rentalAsset),
						  }
						: {
								name: "",
								note: "",
								growthRate: 1,
								totalValue: 0,
								costBasis: 0,
								wPriority: 1,
								owed: 0,
								maintenanceExpense: 0,
								grossIncome: 0,
								federal: "",
								state: "",
								local: "",
								fica: "",
								capitalGains: "",
								owner_id: userId,
						  }
				}>
				{({ handleSubmit, handleChange, values, touched, errors, status }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Rental Asset</h1>
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
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"owed"}
								values={values.owed}
								touched={touched.owed}
								errors={errors.owed}
							/>
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"maintenanceExpense"}
								values={values.maintenanceExpense}
								touched={touched.maintenanceExpense}
								errors={errors.maintenanceExpense}
							/>
							<InputControl
								handleChange={handleChange}
								type={"number"}
								name={"grossIncome"}
								values={values.grossIncome}
								touched={touched.grossIncome}
								errors={errors.grossIncome}
							/>
							<TaxSelector
								level={RouteTypes.FEDERAL}
								stateChanger={handleChange}
								errors={errors.federal}
								touched={touched.federal}
								values={values.federal}
							/>
							<TaxSelector
								level={RouteTypes.STATE}
								stateChanger={handleChange}
								errors={errors.state}
								touched={touched.state}
								values={values.state}
							/>
							<TaxSelector
								level={RouteTypes.LOCAL}
								stateChanger={handleChange}
								errors={errors.local}
								touched={touched.local}
								values={values.local}
							/>
							<TaxSelector
								level={RouteTypes.FICA}
								stateChanger={handleChange}
								errors={errors.fica}
								touched={touched.fica}
								values={values.fica}
							/>
							<TaxSelector
								level={RouteTypes.CAPGAINS}
								stateChanger={handleChange}
								errors={errors.capitalGains}
								touched={touched.capitalGains}
								values={values.capitalGains}
							/>
						</Row>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							{deleteItem != undefined ? (
								<Col xs={12} className={"d-flex flex-row justify-content-center"}>
									<Button onClick={() => deleteItem(rentalAsset.id)}>Delete</Button>
								</Col>
							) : null}
							<Col xs={12} className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={deleteItem != undefined ? "Edit Expense" : "Create Expense"} />
							</Col>
							{status != undefined ? (
								<div className={` text-center ${status.error != undefined ? `text-danger` : ""}`}>
									{status.message}
								</div>
							) : null}
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
