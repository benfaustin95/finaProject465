import { Table } from "react-bootstrap";
import React from "react";
import {
	DestructuredMacroExpense,
	DestructuredMacroIncome,
	DestructuredMacroOutputRow,
	DestructuredMacroReport,
	DestructuredMacroWithdrawal,
	DestructuredTaxAccumulator,
	DestructuredWithMacroOutputRow,
} from "destructureTypes.ts";

export type rowGroup = {
	group: Array<[number, DestructuredMacroOutputRow]>;
};

function OutputRow(props: DestructuredMacroOutputRow) {
	const { name, note, amounts } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<tr>
			<td key={name + "cell"}>{name}</td>
			<td key={note + "cell"}>{name == "remainder" ? "" : note}</td>
			{amounts.map(([year, x]) => (
				<td key={year + name + note + "cell"}>{formater.format(x)}</td>
			))}
		</tr>
	);
}
function RowGroup(props: rowGroup) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([key, value]) => <OutputRow key={value.name + "row"} {...value} />)
				: null}
		</>
	);
}

function WithdrawalRow(props: DestructuredWithMacroOutputRow) {
	const { name, note, amounts, updatedValue } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});
	return (
		<tr>
			<td key={name + "withdrawal"}>{name}</td>
			<td key={note + "withdrawal"}>{note}</td>
			{updatedValue.map(([year, x]) => (
				<td key={year + name + note + "withdrawal"}>{formater.format(x)}</td>
			))}
		</tr>
	);
}

function WithdrawalRowGroup(props: { group: [number, DestructuredWithMacroOutputRow][] }) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([key, value]) => <OutputRow key={value.name} {...value} />)
				: null}
			{group != undefined
				? group.map(([key, value]) => (
						<WithdrawalRow key={value.name + "withdrawal row"} {...value} />
				  ))
				: null}
		</>
	);
}
function BudgetItems(props: DestructuredMacroExpense) {
	const { outputRecurring, outputNonRecurring, annualExpense, monthlyExpense } = props;
	return (
		<>
			<RowGroup group={outputRecurring} />
			<RowGroup group={outputNonRecurring} />
			<OutputRow key={"monthly expense row"} {...monthlyExpense} />
			<OutputRow key={"annual expense row"} {...annualExpense} />
		</>
	);
}

function Taxes(props: DestructuredTaxAccumulator) {
	const {
		federal,
		federalIncome,
		state,
		stateIncome,
		capitalGains,
		capitalGainsIncome,
		fica,
		ficaIncome,
		local,
		localIncome,
	} = props;

	return (
		<>
			<OutputRow
				key={"federal income tax"}
				name={"Federal Income Tax"}
				note={""}
				amounts={federal}
			/>
			<OutputRow
				key={"capital gains tax"}
				name={"Capital Gains Tax"}
				note={""}
				amounts={capitalGains}
			/>
			<OutputRow key={"fica tax"} name={"FICA Tax"} note={""} amounts={fica} />
			<OutputRow key={"state income tax"} name={"State Income Tax"} note={""} amounts={state} />
			<OutputRow key={"Local Income Tax"} name={"Local Income Tax"} note={""} amounts={local} />
		</>
	);
}
function YearlyIncomes(props: DestructuredMacroIncome) {
	const { outRental, outOneTime, outHuman, outSocial, outNonTaxable, taxes } = props;
	return (
		<>
			<OutputRow key={"outSocial"} {...outSocial} />
			<OutputRow key={"outHuman"} {...outHuman} />
			<OutputRow key={"outNonTaxable"} {...outNonTaxable} />
			<OutputRow key={"outRental"} {...outRental} />
			<OutputRow key={"outOneTime"} {...outOneTime} />
			{taxes != undefined ? <Taxes {...taxes} /> : null}
		</>
	);
}

function MacroWithdrawals(props: DestructuredMacroWithdrawal) {
	const { outDividend, outputWithdrawal, remainder } = props;
	return (
		<>
			<RowGroup group={outDividend} />
			<WithdrawalRowGroup group={outputWithdrawal} />
			{remainder != undefined && remainder.note != "" ? (
				<OutputRow key={"remainder"} {...remainder} />
			) : null}
		</>
	);
}

export function MacroYear(props: DestructuredMacroReport) {
	const { expenses, incomes, withdrawals, deficit } = props;

	return (
		<Table className={"border-dark"} responsive striped bordered hover>
			<thead className={"table-dark border-white"}>
				<tr>
					<th>Name</th>
					<th>Note</th>
					{expenses != undefined
						? expenses.annualExpense.amounts.map(([year]) => <th key={year}>{year}</th>)
						: null}
				</tr>
			</thead>
			<tbody>
				{expenses != undefined ? <BudgetItems {...expenses} /> : null}
				{incomes != undefined ? <YearlyIncomes {...incomes} /> : null}
				{deficit != undefined ? <OutputRow key={"deficit row"} {...deficit} /> : null}
				{withdrawals != undefined ? <MacroWithdrawals {...withdrawals} /> : null}
			</tbody>
		</Table>
	);
}
