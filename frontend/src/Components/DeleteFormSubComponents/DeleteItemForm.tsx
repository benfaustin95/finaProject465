import * as yup from "yup";
import { BaseInput } from "../../../../backend/src/db/entities/BaseInput.ts";
import { Col, Container, Row } from "react-bootstrap";
import { Formik } from "formik";
import { SearchItemService } from "@/Services/SearchItemService.tsx";
import { SelectItemControl } from "@/Components/DeleteFormSubComponents/SelectItemControl.tsx";
import Form from "react-bootstrap/Form";
import { SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import { DeleteItemsService } from "@/Services/DeleteItemsService.tsx";

export function DeleteItemForm<T extends BaseInput>(props: { entityName: string; type: string }) {
	const deleteItemSchema = yup.object({
		idsToDelete: yup.array().of(yup.number()).required(),
	});

	function submitForm(event) {
		const idsToDelete = event.idsToDelete;
		DeleteItemsService.send(idsToDelete, props.type)
			.then((res) => {
				if (res.status != 200) console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<Container className={"mx-auto my-4 p-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={deleteItemSchema}
				onSubmit={submitForm}
				initialValues={{
					idsToDelete: [],
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit}>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<SelectItemControl<T>
								handleChange={handleChange}
								values={values.idsToDelete}
								touched={touched.idsToDelete}
								errors={errors.idsToDelete}
								{...props}
							/>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Delete" + props.entityName} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
}
