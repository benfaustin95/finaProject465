import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { Formik } from "formik";
import * as yup from "yup";
import {date, number, string} from "yup";
import { getUserItemFromToken } from "@/Services/Auth.tsx";
import { useState } from "react";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";
import {MaritalStatus, UsersBody} from "@/FrontendTypes.ts";

export const CreateUserForm = () => {
	const searchParams = new URLSearchParams(document.location.search);
	const state = searchParams.get("state");
	const token = searchParams.get("session_token");
	const email = getUserItemFromToken(token, "email");
	const [continueAddress, setContinueAddress] = useState(
		`https://dev-2dtmb35dmkdjhb8l.us.auth0.com/continue?state=${state}`
	);

	const profileSchema = yup.object().shape({
		name: string().required(),
		start: date().required(),
		birthday: date().required().max(new Date(), "birthday must be before today"),
		marital_status: number().oneOf(Object.values(MaritalStatus) as number[]).required(),
	});
	function submitForm(event) {
		const toSubmit: UsersBody = {
			...event,
			email,
		};
		console.log(toSubmit);
		PostInputService.send("/user", toSubmit)
			.then((res) => {
				if (res.status != 200) throw new Error("bad create");
				return res.data;
			})
			.then((data) => {
				window.location.replace(continueAddress);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={profileSchema}
				onSubmit={submitForm}
				initialValues={{
					name: "",
					start: new Date().toISOString().slice(0, 10),
					birthday: new Date().toISOString().slice(0, 10),
					marital_status: 0,
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create User</h1>
						</Row>
						<Row>
							<InputControl
								handleChange={handleChange}
								name={"name"}
								title={"Name"}
								type={"text"}
								values={values.name}
								touched={touched.name}
								errors={errors.name}
							/>
							<Col sm={12} md={4} lg={2}>
								<Form.Label>
									Marital Status
								</Form.Label>
							</Col>
							<Col sm={12} md={8} lg={4}>
								<Form.Select
									onChange={handleChange}
									name={'marital_status'}
									value={values.marital_status}
								>
									<option value={0}>Single</option>
									<option value={1}>Married</option>
									<option value={2}>Widowed</option>
									<option value={3}>Divorced</option>
								</Form.Select>
							</Col>
							<InputControl
								handleChange={handleChange}
								name={"start"}
								type={"date"}
								title={"Retirement Start Date"}
								values={values.start}
								touched={touched.start}
								errors={errors.start}
							/>
							<InputControl
								handleChange={handleChange}
								name={"birthday"}
								type={"date"}
								title={"Birthdate"}
								values={values.birthday}
								touched={touched.birthday}
								errors={errors.birthday}
							/>
						</Row>
						<Row className={"mb-4 d-flex flex-row justify-content-center"}>
							<Col className={"d-flex flex-row justify-content-center"}>
								<SubmitButton name={"Create Profile"} />
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</Container>
	);
};
