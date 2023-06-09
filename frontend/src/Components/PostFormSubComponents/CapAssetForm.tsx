import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { Formik, useFormikContext } from "formik";
import * as formik from "formik";
import * as yup from "yup";
import { date, number, string } from "yup";
import { CAssetBody } from "../../../../backend/src/db/types.ts";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import { CapAssetType, Recurrence } from "../../DoggrTypes.ts";
import { useState } from "react";
import { useAuth } from "@/Services/Auth.tsx";

export function SubmitButton(props: { name: string }) {
	const { dirty, isValid } = useFormikContext();
	const { name } = props;
	return (
		<Button
			as="input"
			className={"btn-lg"}
			type="submit"
			value={name}
			disabled={!isValid || !dirty}
		/>
	);
}

export function RecurrenceSelector(props: { handleChange; values; errors; touched }) {
	const { handleChange, values, errors, touched } = props;
	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor="recurrence">Recurrence</Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<Form.Select
					id="recurrence"
					onChange={handleChange}
					name={"recurrence"}
					value={values}
					isInvalid={!!errors}
					isValid={touched && !errors}>
					<option value={Recurrence.MONTHLY}>Monthly</option>
					<option value={Recurrence.NON}>Non-Reoccurring</option>
					<option value={Recurrence.ANNUALLY}>Annually</option>
					<option value={Recurrence.WEEKLY}>Weekly</option>
					<option value={Recurrence.DAILY}>Daily</option>
				</Form.Select>
			</Col>
		</>
	);
}

export function InputControl(props: {
	handleChange;
	type: string;
	name: string;
	values;
	touched;
	errors;
}) {
	const { handleChange, type, name, values, touched, errors } = props;
	const [dollarInputs, setDollarInputs] = useState([
		"income",
		"expense",
		"totalValue",
		"costBasis",
		"cashBasis",
		"owed",
		"grossIncome",
		"amount",
	]);
	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor={name}>{name}: </Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<InputGroup hasValidation>
					{dollarInputs.includes(name) ? (
						<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
					) : null}
					<Form.Control
						id={name}
						type={type}
						name={name}
						value={values}
						isValid={touched && !errors}
						isInvalid={!!errors}
						onChange={handleChange}
					/>
					{name.toLowerCase().includes("rate") ? (
						<InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
					) : null}
					<Form.Control.Feedback type={"invalid"}>{errors}</Form.Control.Feedback>
				</InputGroup>
			</Col>
		</>
	);
}

export const CapitalAssetForm = () => {
	const { userId } = useAuth();
	function submitForm(event) {
		const toSubmit: CAssetBody = {
			...event,
			owner_id: userId,
		};

		console.log(event);
		PostInputService.send("/capitalAsset", toSubmit)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log("fix error");
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const capitalItemSchema = yup.object().shape({
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
		type: string().required(),
		growthRate: number().required().min(0).max(10),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
		fica: string().default(""),
	});

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={capitalItemSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					start: new Date().toISOString().slice(0, 10),
					end: new Date().toISOString().slice(0, 10),
					income: 0,
					growthRate: 1,
					recurrence: Recurrence.MONTHLY,
					type: CapAssetType.HUMAN,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Capital Income</h1>
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
								type={"capital"}
							/>
							<InputControl
								handleChange={handleChange}
								name={"income"}
								type={"number"}
								values={values.income}
								touched={touched.income}
								errors={errors.income}
							/>
							<Col xs={12} md={4} lg={2} className={"mb-4"}>
								<Form.Label htmlFor="type">Type of Capital Asset: </Form.Label>
							</Col>
							<Col xs={12} md={8} lg={4} className={"mb-4"}>
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
