import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BaseInputForm } from "@/Components/FormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { FinancialAsset } from "../../../../backend/src/db/entities/financialasset.ts";
import { FinAssetService } from "@/Services/FinAssetService.tsx";
import { Formik } from "formik";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { InputControl, SubmitButton } from "@/Components/FormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";
import { number, string } from "yup";
import { DividendBody } from "../../../../backend/src/db/types.ts";

export const DividendForm = () => {
	const [finAssets, setFinAssets] = useState<Array<FinancialAsset>>([]);

	useEffect(() => {
		const loadFinAssets = () => {
			FinAssetService.send(1)
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
		loadFinAssets();
	}, []);

	const dividendSchema = yup.object().shape({
		name: string().required(),
		note: string(),
		rate: number().positive().required(),
		finAsset: number().positive().required().integer(),
		federal: string().default(""),
		state: string().default(""),
		local: string().default(""),
	});

	function submitForm(event) {
		const toSubmit: DividendBody = {
			...event,
			owner_id: 3,
			growthRate: 1,
		};
		PostInputService.send("/dividend", toSubmit)
			.then((res) => {
				console.log(res);
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-50"}>
			<Formik
				validationSchema={dividendSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					note: "",
					rate: 1,
					finAsset: finAssets != undefined && finAssets.length > 0 ? finAssets[0] : 0,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Dividend</h1>
						</Row>
						<BaseInputForm
							handleChange={handleChange}
							valuesNote={values.note}
							valuesName={values.name}
							touchedNote={touched.note}
							touchedName={touched.name}
							errorsName={errors.name}
							errorsNote={errors.note}
							type={"dividend"}
						/>
						<Row className={"mb-4"}>
							<InputControl
								handleChange={handleChange}
								name={"rate"}
								type={"number"}
								values={values.rate}
								touched={touched.rate}
								errors={errors.rate}
							/>
						</Row>
						<Row className={"mb-4"}>
							<Col xs={12} md={4}>
								<Form.Label htmlFor="finAsset">Financial Asset: </Form.Label>
							</Col>
							<Col xs={12} md={8}>
								<Form.Select
									id="finAsset"
									name={"finAsset"}
									value={values.finAsset}
									isValid={touched.finAsset && !errors.finAsset}
									isInvalid={!!errors.finAsset}
									onChange={handleChange}>
									{finAssets.map((x) => (
										<option key={x.id} value={x.id}>
											{x.name}
										</option>
									))}
								</Form.Select>
							</Col>
						</Row>
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
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Create Dividend"} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
