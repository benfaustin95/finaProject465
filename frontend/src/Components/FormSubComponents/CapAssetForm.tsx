import Form from "react-bootstrap/Form";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { Formik } from "formik";
import * as yup from "yup";
import { date, number, string } from "yup";
import { CAssetBody } from "../../../../backend/src/db/types.ts";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";

export const CapitalAssetForm = () => {
	function submitForm(event) {
		const toSubmit: CAssetBody = {
			...event,
			owner_id: 3,
		};

		console.log(event);
		// PostInputService.send("/capitalAsset", toSubmit)
		// 	.then((res) => {
		// 		console.log(res);
		// 		if (res.status != 200) console.log("fix error");
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}

	const capitalItemSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		amount: number().positive().required(),
		recurrence: string().required(),
		start: date().required(),
		end: date().required(),
		type: string().required(),
		growthRate: number().required().positive().max(10),
		federal: string(),
	});

	return (
		<Container>
			<Formik
				validationSchema={capitalItemSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					amount: 0,
					recurrence: "monthly",
					start: "2023-1-1",
					end: "2032-1-1",
					type: "Human Capital",
					growthRate: 1,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit}>
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
						<Form.Label htmlFor="amount">Amount: </Form.Label>
						<InputGroup hasValidation>
							<InputGroup.Text>$</InputGroup.Text>
							<Form.Control
								id="amount"
								type="number"
								name={"amount"}
								value={values.amount}
								placeholder="item amount...."
								isValid={touched.amount && !errors.amount}
								isInvalid={!!errors.amount}
								onChange={handleChange}
							/>
							<Form.Control.Feedback type={"invalid"}>{errors.amount}</Form.Control.Feedback>
						</InputGroup>
						<Form.Label htmlFor="type">Type of Capital Asset: </Form.Label>
						<Form.Select
							id="type"
							name={"type"}
							onChange={handleChange}
							value={values.type}
							isInvalid={!!errors.type}
							isValid={touched.type && !errors.type}>
							<option value="Human Capital">Human Capital</option>
							<option value="Non-Taxable Annuity">NonTaxable</option>
							<option value="Social Capital">Social</option>
						</Form.Select>
						<Form.Label htmlFor="reccurrence">Recurrence</Form.Label>
						<Form.Select
							id="recurrence"
							onChange={handleChange}
							name={"recurrence"}
							value={values.recurrence}
							isInvalid={!!errors.recurrence}
							isValid={touched.recurrence && !errors.recurrence}>
							<option value="monthly">Monthly</option>
							<option value="non-reocurring">Non-Reoccurring</option>
							<option value="annually">Annually</option>
							<option value="weekly">Weekly</option>
							<option value="daily">Daily</option>
						</Form.Select>
						<Form.Label htmlFor="start">Start: </Form.Label>
						<Form.Control
							id="start"
							type="date"
							name={"start"}
							value={values.start}
							isValid={touched.start && !errors.start}
							isInvalid={!!errors.start}
							onChange={handleChange}
						/>
						<Form.Control.Feedback type={"invalid"}>{errors.start}</Form.Control.Feedback>
						<Form.Label htmlFor="end">End: </Form.Label>
						<Form.Control
							id="end"
							type="date"
							name={"end"}
							value={values.end}
							isValid={touched.end && !errors.end}
							isInvalid={!!errors.end}
							onChange={handleChange}
						/>
						<Form.Control.Feedback type={"invalid"}>{errors.end}</Form.Control.Feedback>
						<TaxSelector level={"federal"} stateChanger={handleChange} errors={errors.federal} />
						<Button type="submit">Create Expense</Button>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
