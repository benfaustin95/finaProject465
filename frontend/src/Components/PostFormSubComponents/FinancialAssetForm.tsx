import { RFBaseForm } from "@/Components/PostFormSubComponents/RFBase.tsx";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import * as yup from "yup";
import { number, string } from "yup";
import { Formik } from "formik";
import { getGrowthRatePercent, getTax, RFBase, RouteTypes } from "@/FrontendTypes.ts";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";

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
		growthRate: number().required().positive().max(1000),
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
							name: finAsset.name,
							note: finAsset.note,
							growthRate: getGrowthRatePercent(finAsset.growthRate),
							totalValue: finAsset.totalValue,
							costBasis: finAsset.costBasis,
							wPriority: finAsset.wPriority,
							owner_id: finAsset.owner_id,
							id: finAsset.id,
							...getTax(finAsset),
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
			{({ handleSubmit, handleChange, values, touched, errors, status }) => (
				<Form onSubmit={handleSubmit} className={"p-4"}>
					<Row className={"m-4 justify-content-center"}>
						<h1 className={"text-center"}>{`${
							finAsset != undefined ? "Update" : "Create"
						} Financial Asset`}</h1>
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
							type={RouteTypes.FINASSET}
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
					</Row>{" "}
					<Row className={"mb-4 d-flex flex-row justify-content-center"}>
						<Col className={"d-flex flex-row justify-content-center"}>
							{deleteItem != undefined ? (
								<Button className={"btn-lg mr-2"} onClick={() => deleteItem(finAsset.id)}>
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
