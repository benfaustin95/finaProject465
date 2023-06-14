import { Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Recurrence } from "@/FrontendTypes.ts";

export function RecurrenceSelector(props: { handleChange; values; errors; touched }) {
	const { handleChange, values, errors, touched } = props;
	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor="recurrence">Recurrence</Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<Form.Select
					id="recurrence"
					onChange={handleChange}
					name={"recurrence"}
					value={values}
					isInvalid={!!errors}
					isValid={touched && !errors}>
					<option value={Recurrence.MONTHLY}>Monthly</option>
					<option value={Recurrence.NON}>Non-Reoccurring</option>
					<option value={Recurrence.ANNUALLY}>Annually</option>
					<option value={Recurrence.WEEKLY}>Weekly</option>
					<option value={Recurrence.DAILY}>Daily</option>
				</Form.Select>
			</Col>
		</>
	);
}
