import Form from "react-bootstrap/Form";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { date, string } from "yup";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";
import { SubmitButton } from "@/Components/PostFormSubComponents/FormSubComponents/SubmitButton.tsx";
import { UsersBody } from "@/FrontendTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { useEffect, useState } from "react";
import { GetUserProfileService } from "@/Services/GetUserProfileService.tsx";

export const UpdateUserForm = (props: { submitForm: any; deleteItem: any }) => {
	const { submitForm, deleteItem } = props;
	const { userId, email } = useAuth();
	const [user, setUser] = useState<UsersBody>(null);
	const [isLoading, setIsLoading] = useState(true);

	const profileSchema = yup.object().shape({
		name: string().required(),
		start: date().required(),
		birthday: date().required().max(new Date(), "birthday must be before today"),
	});

	useEffect(() => {
		GetUserProfileService.send(email)
			.then((res) => {
				if (res.status != 200) throw new Error();
				return res.data;
			})
			.then((res) => {
				setUser(res);
				console.log(user);
				setIsLoading(false);
			})
			.catch((err) => {
				alert("failed to load profile");
				setIsLoading(false);
			});
	}, []);

	if (isLoading) return <div>Is Loading....</div>;
	return (
		<Container className={"mx-auto my-4 bg-light rounded-5 w-75"}>
			<Formik
				validationSchema={profileSchema}
				validateOnChange={false}
				validateOnBlur={false}
				onSubmit={submitForm}
				initialValues={
					user != null
						? {
								name: user.name,
								start: new Date(user.start).toISOString().slice(0, 10),
								birthday: new Date(user.birthday).toISOString().slice(0, 10),
								id: user.id,
						  }
						: {
								name: "",
								start: new Date().toISOString().slice(0, 10),
								birthday: new Date().toISOString().slice(0, 10),
						  }
				}>
				{({ handleSubmit, handleChange, values, touched, errors, status }) => (
					<Form onSubmit={handleSubmit} className={"p-4"}>
						<Row className={"m-4 justify-content-center"}>
							<h1 className={"text-center"}>Update Profile</h1>
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
							<Col xs={6} className={"d-flex flex-row justify-content-end"}>
								<Button className={"btn-lg"} onClick={() => deleteItem(userId)}>
									Delete User
								</Button>
							</Col>
							<Col xs={6} className={"d-flex flex-row justify-content-begin"}>
								<SubmitButton name={"Update Profile"} />
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
		</Container>
	);
};
