import Form from "react-bootstrap/Form";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { useState } from "react";

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
			<Form.Label htmlFor="name">Name:</Form.Label>
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
			<Form.Label htmlFor="note">Note:</Form.Label>
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
			{type != "budget" ? (
				<>
					<Form.Label htmlFor="growthRate">Growth Rate:</Form.Label>
					<Form.Control
						id="note"
						type="number"
						name={"growthRate"}
						value={valuesGrowthRate}
						placeholder="item growth rate...."
						isValid={touchedGrowthRate && !errorsGrowth}
						isInvalid={!!errorsGrowth}
						onChange={handleChange}
					/>
				</>
			) : null}
			<Form.Control.Feedback type={"invalid"}>{errorsGrowth}</Form.Control.Feedback>
		</>
	);
};
