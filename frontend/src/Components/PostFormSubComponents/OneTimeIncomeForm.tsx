import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { Formik } from "formik";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import { InputControl, SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";
import { date, number, string } from "yup";
import { useAuth } from "@/Services/Auth.tsx";
import { OneTimeIncome } from "@/DoggrTypes.ts";

export const OneTimeIncomeForm = (props: {
	submitForm: any;
	oneTimeIncome?: OneTimeIncome;
	deleteItem?: any;
}) => {
	const { userId } = useAuth();
	const { submitForm, oneTimeIncome, deleteItem } = props;
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
		owner_id: number().default(userId),
	});

	return (
		<Formik
			validationSchema={oneTimeIncomeSchema}
			onSubmit={submitForm}
			initialValues={
				oneTimeIncome != undefined
					? {
							...oneTimeIncome,
							date: new Date(oneTimeIncome.date).toISOString().slice(0, 10),
					  }
					: {
							name: "",
							note: "",
							date: new Date().toISOString().slice(0, 10),
							cashBasis: 0,
							growthRate: 1,
							federal: "",
							state: "",
							local: "",
							fica: "",
							owner_id: userId,
					  }
			}>
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
							values={values.date}
							touched={touched.date}
							errors={errors.date}
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
							{deleteItem != undefined ? (
								<Button className={"btn-lg mr-2"} onClick={() => deleteItem(oneTimeIncome.id)}>
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
