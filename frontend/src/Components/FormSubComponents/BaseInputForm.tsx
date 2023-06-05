import Form from "react-bootstrap/Form";
import { TaxSelector } from "@/Components/FormSubComponents/TaxComponents.tsx";
import { useState } from "react";

export type baseInputForm = {
	nameChanger;
	noteChanger;
	growthRateChanger?;
	federalChanger?;
	capitalGainsChanger?;
	ficaChanger?;
	stateChanger?;
	localChanger?;
};
export const BaseInputForm = (props: baseInputForm) => {
	const {
		nameChanger,
		noteChanger,
		growthRateChanger,
		federalChanger,
		capitalGainsChanger,
		ficaChanger,
		stateChanger,
		localChanger,
	} = props;

	return (
		<>
			<Form.Label htmlFor="itemName">Name:</Form.Label>
			<Form.Control
				id="itemName"
				type="text"
				placeholder="item name...."
				onChange={(e) => nameChanger(e.target.value)}
			/>
			<Form.Label htmlFor="itemNote">Note:</Form.Label>
			<Form.Control
				id="itemNote"
				type="text"
				placeholder="item note...."
				onChange={(e) => noteChanger(e.target.value)}
			/>
			{growthRateChanger != undefined ? (
				<>
					<Form.Label htmlFor="itemGrowthRate">Growth Rate:</Form.Label>
					<Form.Control
						id="itemGrowthRate"
						type="text"
						placeholder="item note...."
						onChange={(e) => growthRateChanger(Number.parseFloat(e.target.value))}
					/>
				</>
			) : null}
			{federalChanger != undefined ? (
				<TaxSelector stateChanger={federalChanger} level={"federal"} />
			) : null}
			{capitalGainsChanger != undefined ? (
				<TaxSelector stateChanger={capitalGainsChanger} level={"capitalGains"} />
			) : null}
			{ficaChanger != undefined ? <TaxSelector level={"fica"} stateChanger={ficaChanger} /> : null}
			{stateChanger != undefined ? (
				<TaxSelector level={"state"} stateChanger={stateChanger} />
			) : null}
			{localChanger != undefined ? (
				<TaxSelector level={"local"} stateChanger={localChanger} />
			) : null}
		</>
	);
};
