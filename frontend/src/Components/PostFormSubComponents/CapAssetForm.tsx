import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { Formik } from "formik";
import * as yup from "yup";
import { date, number, string } from "yup";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import {
	CapAsset,
	CapAssetType,
	getGrowthRatePercent,
	getTax,
	Recurrence,
	RouteTypes,
} from "@/FrontendTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";
import { RecurrenceSelector } from "@/Components/PostFormSubComponents/FormSubComponents/RecurrenceSelector.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";

export const CapitalAssetForm = (props: {
	submitForm: any;
	capAsset?: CapAsset;
	deleteItem?: any;
}) => {
	const { submitForm, capAsset, deleteItem } = props;
	const { userId } = useAuth();

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
		growthRate: number().required().min(0).max(1000),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
		fica: string().default(""),
		owner_id: number().required().default(userId),
	});

	return (
		<Formik
			validationSchema={capitalItemSchema}
			onSubmit={submitForm}
			initialValues={
				capAsset != undefined
					? {
							name: capAsset.name,
							note: capAsset.note,
							start: new Date(capAsset.start).toISOString().slice(0, 10),
							end: new Date(capAsset.end).toISOString().slice(0, 10),
							income: capAsset.income,
							growthRate: getGrowthRatePercent(capAsset.growthRate),
							recurrence: capAsset.recurrence,
							type: capAsset.type,
							owner_id: userId,
							id: capAsset.id,
							...getTax(capAsset),
					  }
					: {
							name: "",
							note: "",
							start: new Date().toISOString().slice(0, 10),
							end: new Date().toISOString().slice(0, 10),
							income: 0,
							growthRate: 1,
							recurrence: Recurrence.MONTHLY,
							type: CapAssetType.HUMAN,
							owner_id: userId,
							federal: "",
							state: "",
							local: "",
							fica: "",
					  }
			}>
			{({ handleSubmit, handleChange, values, touched, errors, status }) => (
				<Form onSubmit={handleSubmit} className={"p-4"}>
					<Row className={"m-4 justify-content-center"}>
						<h1 className={"text-center"}>{`${
							capAsset != undefined ? "Update" : "Create"
						} Capital Income`}</h1>
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
							title={"Amount of Income"}
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
							title={"Start Date"}
							values={values.start}
							touched={touched.start}
							errors={errors.start}
						/>
						<InputControl
							handleChange={handleChange}
							name={"end"}
							type={"date"}
							title={"End Date"}
							values={values.end}
							touched={touched.end}
							errors={errors.end}
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
					</Row>
					<Row className={"mb-4 d-flex flex-row justify-content-center"}>
						<Col className={"d-flex flex-row justify-content-center"}>
							{deleteItem != undefined ? (
								<Button className={"btn-lg mr-2"} onClick={() => deleteItem(capAsset.id)}>
									Delete
								</Button>
							) : null}
							<SubmitButton name={deleteItem != undefined ? "Edit Item" : "Create Item"} />
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
	);
};
