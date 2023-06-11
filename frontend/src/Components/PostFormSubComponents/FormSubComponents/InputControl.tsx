import { useState } from "react";
import { Col, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export function InputControl(props: {
	handleChange;
	type: string;
	name: string;
	values;
	touched;
	errors;
}) {
	const { handleChange, type, name, values, touched, errors } = props;
	const [dollarInputs, setDollarInputs] = useState([
		"income",
		"expense",
		"totalValue",
		"costBasis",
		"cashBasis",
		"owed",
		"grossIncome",
		"amount",
	]);
	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor={name}>{name}: </Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<InputGroup hasValidation>
					{dollarInputs.includes(name) ? (
						<InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
					) : null}
					<Form.Control
						id={name}
						type={type}
						name={name}
						value={values}
						isValid={touched && !errors}
						isInvalid={!!errors}
						onChange={handleChange}
					/>
					{name.toLowerCase().includes("rate") ? (
						<InputGroup.Text id="inputGroupPrepend">%</InputGroup.Text>
					) : null}
					<Form.Control.Feedback type={"invalid"}>{errors}</Form.Control.Feedback>
				</InputGroup>
			</Col>
		</>
	);
}
