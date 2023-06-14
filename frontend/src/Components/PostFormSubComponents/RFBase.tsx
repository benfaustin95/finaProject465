import { InputControl } from "@/Components/PostFormSubComponents/FormSubComponents/InputControl.tsx";

export type rfBaseForm = {
	handleChange;
	errorsTotalValue;
	touchedTotalValue;
	valuesTotalValue;
	errorsCostBasis;
	touchedCostBasis;
	valuesCostBasis;
	errorsWPriority;
	valuesWPriority;
	touchedWPriority;
};

export const RFBaseForm = (props: rfBaseForm) => {
	const {
		handleChange,
		errorsTotalValue,
		errorsWPriority,
		errorsCostBasis,
		touchedTotalValue,
		touchedWPriority,
		touchedCostBasis,
		valuesWPriority,
		valuesTotalValue,
		valuesCostBasis,
	} = props;
	return (
		<>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"totalValue"}
				values={valuesTotalValue}
				touched={touchedTotalValue}
				errors={errorsTotalValue}
			/>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"costBasis"}
				values={valuesCostBasis}
				touched={touchedCostBasis}
				errors={errorsCostBasis}
			/>
			<InputControl
				handleChange={handleChange}
				type={"number"}
				name={"wPriority"}
				values={valuesWPriority}
				touched={touchedWPriority}
				errors={errorsWPriority}
			/>
		</>
	);
};
