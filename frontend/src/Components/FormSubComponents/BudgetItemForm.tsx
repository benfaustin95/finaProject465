import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { PostInputService } from "@/Services/PostInputService.tsx";
import * as yup from "yup";
import { date, number, string } from "yup";
import { Formik } from "formik";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { CapAssetType } from "@/DoggrTypes.ts";
import {
	InputControl,
	RecurrenceSelector,
	SubmitButton,
} from "@/Components/FormSubComponents/CapAssetForm.tsx";
export const BudgetItemForm = () => {
	function submitForm(event) {
		const toSubmit = {
			...event,
			growthRate: 1,
			owner_id: 3,
		};
		PostInputService.send("/budgetItem", toSubmit)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log("bad");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const budgetItemSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		income: number().positive().required(),
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
	});

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-50"}>
			<Formik
				validationSchema={budgetItemSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					amount: 0,
					recurrence: "monthly",
					start: new Date().toISOString().slice(0, 10),
					end: new Date().toISOString().slice(0, 10),
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Expense</h1>
						</Row>
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
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								name={"income"}
								type={"number"}
								values={values.income}
								touched={touched.income}
								errors={errors.income}
							/>
						</Row>
						<Row className={"mb-4"}>
							<Col xs={12} md={4}>
								<Form.Label htmlFor="type">Type of Capital Asset: </Form.Label>
							</Col>
							<Col xs={12} md={8}>
								<Form.Select
									id="type"
									name={"type"}
									onChange={handleChange}
									value={values.type}
									isInvalid={!!errors.type}
									isValid={touched.type && !errors.type}>
									<option value={CapAssetType.HUMAN}>Human Capital</option>
									<option value={CapAssetType.NONTAXABLEANNUITY}>NonTaxable</option>
									<option value={CapAssetType.SOCIAL}>Social</option>
								</Form.Select>
							</Col>
						</Row>
						<Row className={"mb-4"}>
							<RecurrenceSelector
								handleChange={handleChange}
								values={values.recurrence}
								errors={errors.recurrence}
								touched={touched.recurrence}
							/>
						</Row>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								name={"start"}
								type={"date"}
								values={values.start}
								touched={touched.start}
								errors={errors.start}
							/>
						</Row>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								name={"end"}
								type={"date"}
								values={values.end}
								touched={touched.end}
								errors={errors.end}
							/>
						</Row>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Create Expense"} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
