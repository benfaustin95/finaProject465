import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { TaxService } from "@/Services/TaxService.tsx";
import { Col, Row } from "react-bootstrap";
import { TaxObject } from "@/DoggrTypes.ts";

export const TaxSelector = (props: {
	level: string;
	stateChanger: any;
	errors: any;
	touched: any;
	values: any;
}) => {
	const { level, stateChanger, errors, touched, values } = props;
	const [tax, setTax] = useState<Array<TaxObject>>([]);

	useEffect(() => {
		const loadTax = () => {
			TaxService.send(level)
				.then((res) => {
					if (res.status != 200) throw Error();
					return res.data;
				})
				.then((res) => {
					setTax(res);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		loadTax();
	}, []);

	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor={level}>{level}: </Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<Form.Select
					id={level}
					name={level}
					value={values}
					onChange={stateChanger}
					isInvalid={!!errors}
					isValid={touched && !errors}>
					{tax.length != 0
						? tax.map((x) => (
								<option key={x.level + x.location} value={x.location}>
									{x.level + " - " + x.location + " - " + Math.round(x.rate * 100) + "%"}
								</option>
						  ))
						: null}
					<option value="">Not Applicable</option>
				</Form.Select>
				<Form.Control.Feedback type={"invalid"}>{errors}</Form.Control.Feedback>
			</Col>
		</>
	);
};
