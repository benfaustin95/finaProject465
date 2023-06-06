import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { TaxService } from "@/Services/TaxService.tsx";
import { TaxRate } from "../../../../backend/src/db/entities/Tax.ts";
import { Col, Row } from "react-bootstrap";

export const TaxSelector = (props: {
	level: string;
	stateChanger: any;
	errors: any;
	touched: any;
	values: any;
}) => {
	const { level, stateChanger, errors, touched, values } = props;
	const [tax, setTax] = useState<Array<TaxRate>>([]);

	useEffect(() => {
		const loadTax = () => {
			TaxService.send(level == "capitalgains" ? "capitalGains" : level.toLowerCase())
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
	});

	return (
		<Row className={"mb-4"}>
			<Col xs={12} md={4}>
				<Form.Label htmlFor={level}>{level}: </Form.Label>
			</Col>
			<Col xs={12} md={8}>
				<Form.Select
					id={level}
					name={level.toLowerCase()}
					value={values}
					onChange={stateChanger}
					isInvalid={!!errors}
					isValid={touched && !errors}>
					{tax.length != 0
						? tax.map((x) => (
								<option key={x.level + x.location} value={x.location}>
									{x.level + " - " + x.location + "-" + x.rate}
								</option>
						  ))
						: null}
					<option value="">Not Applicable</option>
				</Form.Select>
				<Form.Control.Feedback type={"invalid"}>{errors}</Form.Control.Feedback>
			</Col>
		</Row>
	);
};
