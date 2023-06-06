import Form from "react-bootstrap/Form";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { InputControl } from "@/Components/FormSubComponents/CapAssetForm.tsx";

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
			<Row className={"mb-4"}>
				<Col xs={12} md={4}>
					<Form.Label htmlFor="name">Name:</Form.Label>
				</Col>
				<Col xs={12} md={8}>
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
			</Row>
			<Row className={"mb-4"}>
				<Col xs={12} md={4}>
					<Form.Label htmlFor="note">Note:</Form.Label>
				</Col>
				<Col xs={12} md={8}>
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
			</Row>
			{type != "budget" && type != "dividend" ? (
				<Row className={"mb-4"}>
					<InputControl
						handleChange={handleChange}
						type={"number"}
						name={"growthRate"}
						values={valuesGrowthRate}
						touched={touchedGrowthRate}
						errors={errorsGrowth}
					/>
				</Row>
			) : null}
		</>
	);
};
