import Form from "react-bootstrap/Form";
import { Col } from "react-bootstrap";
import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";

export type baseInputForm = {
	handleChange: any;
	valuesNote: any;
	valuesName: any;
	valuesGrowthRate?: any;
	touchedNote: any;
	touchedName: any;
	touchedGrowthRate?: any;
	errorsName: any;
	errorsNote: any;
	errorsGrowth?: any;
	type: string;
};
export const BaseInputForm = (props: baseInputForm) => {
	const {
		handleChange,
		valuesGrowthRate,
		valuesNote,
		valuesName,
		touchedNote,
		touchedName,
		touchedGrowthRate,
		errorsNote,
		errorsName,
		errorsGrowth,
		type,
	} = props;

	return (
		<>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor="name">Name:</Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<Form.Control
					id="name"
					type="text"
					name={"name"}
					value={valuesName}
					placeholder="item name...."
					isInvalid={!!errorsName}
					isValid={touchedName && !errorsName}
					onChange={handleChange}
				/>
				<Form.Control.Feedback type={"invalid"}>{errorsName}</Form.Control.Feedback>
			</Col>
			<Col xs={12} md={4} lg={2} className={"mb-4"}>
				<Form.Label htmlFor="note">Note:</Form.Label>
			</Col>
			<Col xs={12} md={8} lg={4} className={"mb-4"}>
				<Form.Control
					id="note"
					type="text"
					name={"note"}
					value={valuesNote}
					placeholder="item note...."
					isValid={touchedNote && !errorsNote}
					isInvalid={!!errorsNote}
					onChange={handleChange}
				/>
				<Form.Control.Feedback type={"invalid"}>{errorsNote}</Form.Control.Feedback>
			</Col>
			{type != "budget" && type != "dividend" ? (
				<InputControl
					handleChange={handleChange}
					type={"number"}
					name={"growthRate"}
					values={valuesGrowthRate}
					touched={touchedGrowthRate}
					errors={errorsGrowth}
				/>
			) : null}
		</>
	);
};
