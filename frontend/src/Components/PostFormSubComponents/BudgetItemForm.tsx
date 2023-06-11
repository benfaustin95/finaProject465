import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as yup from "yup";
import { date, number, string } from "yup";
import { Formik } from "formik";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import {
	InputControl,
	RecurrenceSelector,
	SubmitButton,
} from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { BudgetItem } from "@/DoggrTypes.ts";
export const BudgetItemForm = (props: {
	submitForm: any;
	budgetItem?: BudgetItem;
	deleteItem?: any;
}) => {
	const { submitForm, budgetItem, deleteItem } = props;
	const { userId } = useAuth();

	const budgetItemSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		amount: number().positive().required(),
		recurrence: string().required(),
		start: date()
			.required()
			.default(() => new Date()),
		end: date()
			.default(null)
			.when(
				"start",
				(start, yup) => start != null && yup.min(start, "End Date cannot be before start time")
			)
			.required(),
		growthRate: number().default(1),
		owner_id: number().positive(),
	});

	return (
		<Formik
			validationSchema={budgetItemSchema}
			onSubmit={submitForm}
			initialValues={
				budgetItem != undefined
					? {
							...budgetItem,
							start: new Date(budgetItem.start).toISOString().slice(0, 10),
							end: new Date(budgetItem.end).toISOString().slice(0, 10),
					  }
					: {
							name: "",
							note: "",
							amount: 0,
							recurrence: "monthly",
							start: new Date().toISOString().slice(0, 10),
							end: new Date().toISOString().slice(0, 10),
							growthRate: 1,
							owner_id: userId,
					  }
			}>
			{({ handleSubmit, handleChange, values, touched, errors }) => (
				<Form onSubmit={handleSubmit}>
					<Row className={"m-4 justify-content-center"}>
						<h1 className={"text-center"}>
							{deleteItem != undefined ? "Edit Expense" : "Create Expense"}
						</h1>
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
							type={"budget"}
						/>
						<InputControl
							handleChange={handleChange}
							name={"amount"}
							type={"number"}
							values={values.amount}
							touched={touched.amount}
							errors={errors.amount}
						/>
						<RecurrenceSelector
							handleChange={handleChange}
							values={values.recurrence}
							errors={errors.recurrence}
							touched={touched.recurrence}
						/>
						<InputControl
							handleChange={handleChange}
							name={"start"}
							type={"date"}
							values={values.start}
							touched={touched.start}
							errors={errors.start}
						/>
						<InputControl
							handleChange={handleChange}
							name={"end"}
							type={"date"}
							values={values.end}
							touched={touched.end}
							errors={errors.end}
						/>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								{deleteItem != undefined ? (
									<Button className={"btn-lg mr-2"} onClick={() => deleteItem(budgetItem.id)}>
										Delete
									</Button>
								) : null}
								<SubmitButton name={deleteItem != undefined ? "Edit Expense" : "Create Expense"} />
							</Col>
						</Row>
					</Row>
				</Form>
			)}
		</Formik>
	);
};
