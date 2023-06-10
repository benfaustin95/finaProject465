import Form from "react-bootstrap/Form";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { BaseInputForm } from "@/Components/PostFormSubComponents/BaseInputForm.tsx";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { FinancialAsset } from "../../../../backend/src/db/entities/financialasset.ts";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { Formik } from "formik";
import { TaxSelector } from "@/Components/PostFormSubComponents/TaxComponents.tsx";
import { InputControl, SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";
import { number, string } from "yup";
import { DividendBody } from "../../../../backend/src/db/types.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { Dividend } from "@/DoggrTypes.ts";

export const DividendForm = (props: { submitForm: any; dividend?: Dividend; deleteItem?: any }) => {
	const [finAssets, setFinAssets] = useState<Array<FinancialAsset>>([]);
	const { userId } = useAuth();
	const { submitForm, dividend, deleteItem } = props;
	useEffect(() => {
		const loadSearchItem = () => {
			SearchItemService.send(userId, "dividend")
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
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={dividendSchema}
				onSubmit={submitForm}
				initialValues={
					dividend != undefined
						? {
								...dividend,
								asset:
									finAssets != undefined && finAssets.find((x) => x.id == dividend.asset)
										? finAssets.find((x) => x.id == dividend.asset).id
										: 0,
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
				{({ handleSubmit, handleChange, values, touched, errors }) => (
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
								type={"dividend"}
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
						</Row>
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
