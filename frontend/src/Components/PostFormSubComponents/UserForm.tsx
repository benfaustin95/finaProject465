import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import { PostInputService } from "@/Services/PostInputService.tsx";
import { Formik } from "formik";
import { InputControl, SubmitButton } from "@/Components/PostFormSubComponents/CapAssetForm.tsx";
import * as yup from "yup";
import { date, string } from "yup";
import { getUserItemFromToken, useAuth } from "@/Services/Auth.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UsersBody } from "../../../../backend/src/db/backendTypes/createTypes.ts";

export const UserForm = () => {
	const searchParams = new URLSearchParams(document.location.search);
	const state = searchParams.get("state");
	const token = searchParams.get("session_token");
	const email = getUserItemFromToken(token, "email");
	const navigate = useNavigate();
	const [continueAddress, setContinueAddress] = useState(
		`https://dev-2dtmb35dmkdjhb8l.us.auth0.com/continue?state=${state}`
	);
	const { updateUserID, userId } = useAuth();

	const profileSchema = yup.object().shape({
		name: string().required(),
		start: date().required(),
		birthday: date().required().max(new Date(), "birthday must be before today"),
	});
	function submitForm(event) {
		const toSubmit: UsersBody = {
			...event,
			email,
		};
		console.log("here2");
		console.log(email);
		PostInputService.send("/user", toSubmit)
			.then((res) => {
				if (res.status != 200) throw new Error("bad create");
				return res.data;
			})
			.then((data) => {
				console.log(data.id);
				updateUserID(data.id);
				console.log(userId);
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
				}}>
				{({ handleSubmit, handleChange, values, touched, errors }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Create Profile</h1>
						</Row>
						<Row>
							<InputControl
								handleChange={handleChange}
								name={"name"}
								type={"text"}
								values={values.name}
								touched={touched.name}
								errors={errors.name}
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
								name={"birthday"}
								type={"date"}
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
