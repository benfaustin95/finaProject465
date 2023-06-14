import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { Formik } from "formik";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import * as yup from "yup";
import { number, string } from "yup";
import { useAuth } from "@/Services/Auth.tsx";
import { Dividend, getTax, RFBase, RouteTypes } from "@/FrontendTypes.ts";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";

export const DividendForm = (props: { submitForm: any; dividend?: Dividend; deleteItem?: any }) => {
	const [finAssets, setFinAssets] = useState<Array<RFBase>>([]);
	const { userId } = useAuth();
	const { submitForm, dividend, deleteItem } = props;

	useEffect(() => {
		const loadSearchItem = () => {
			SearchItemService.send(userId, RouteTypes.FINASSET)
				.then((res) => {
					if (res.status != 200) throw Error();
					return res.data;
				})
				.then((res) => {
					setFinAssets(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		loadSearchItem();
	}, []);

	const dividendSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		rate: number().positive().required(),
		asset: number().positive().required().integer(),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
	});

	return (
		<Formik
			validationSchema={dividendSchema}
			onSubmit={submitForm}
			initialValues={
				dividend != undefined
					? {
							name: dividend.name,
							note: dividend.note,
							rate: dividend.rate,
							asset: dividend.asset,
							growthRate: 1,
							owner_id: userId,
							id: dividend.id,
							...getTax(dividend),
					  }
					: {
							name: "",
							note: "",
							rate: 1,
							asset: finAssets != undefined && finAssets.length > 0 ? finAssets[0].id : 0,
							growthRate: 1,
							owner_id: userId,
							state: "",
							federal: "",
							local: "",
					  }
			}>
			{({ handleSubmit, handleChange, values, touched, errors, status }) => (
				<Form onSubmit={handleSubmit} className={"p-4"}>
					<Row className={"m-4 justify-content-center"}>
						<h1 className={"text-center"}>Create Dividend</h1>
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
							type={RouteTypes.DIVIDEND}
						/>
						<InputControl
							handleChange={handleChange}
							name={"rate"}
							type={"number"}
							values={values.rate}
							touched={touched.rate}
							errors={errors.rate}
						/>
						<Col xs={12} md={4} lg={2} className={"mb-4"}>
							<Form.Label htmlFor="finAsset">Financial Asset: </Form.Label>
						</Col>
						<Col xs={12} md={8} lg={4}>
							<Form.Select
								id="finAsset"
								name={"asset"}
								value={values.asset}
								isValid={touched.asset && !errors.asset}
								isInvalid={!!errors.asset}
								onChange={handleChange}>
								{finAssets.map((x) => (
									<option key={x.id} value={x.id}>
										{x.name}
									</option>
								))}
							</Form.Select>
						</Col>
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
					</Row>
					<Row className={"mb-4 d-flex flex-row justify-content-center"}>
						<Col className={"d-flex flex-row justify-content-center"}>
							{deleteItem != undefined ? (
								<Button className={"btn-lg mr-2"} onClick={() => deleteItem(dividend.id)}>
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
