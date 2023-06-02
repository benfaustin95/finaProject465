import {
	destructuredExpenseYear,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredOutputRow,
	destructuredTaxAccumulator,
	destructuredWithdrawal,
	destructuredWithOutputRow,
	taxAccumulator,
	withdrawal,
} from "../../../backend/src/db/types.js";
import { Container, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Simulate } from "react-dom/test-utils";
import waiting = Simulate.waiting;

export type rowGroup = {
	group: Array<[number, destructuredOutputRow]>;
};

function Row(props: destructuredOutputRow) {
	const { name, note, amounts } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<tr>
			<td key={name + "cell"}>{name}</td>
			<td key={note + "cell"}>{note}</td>
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
				? group.map(([key, value]) => <Row key={value.name + "row"} {...value} />)
				: null}
		</>
	);
}

function WithdrawalRow(props: destructuredWithOutputRow) {
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

function WithdrawalRowGroup(props: { group: [number, destructuredWithOutputRow][] }) {
	const { group } = props;
	return (
		<>
			{group != undefined ? group.map(([key, value]) => <Row key={value.name} {...value} />) : null}
			{group != undefined
				? group.map(([key, value]) => (
						<WithdrawalRow key={value.name + "withdrawal row"} {...value} />
				  ))
				: null}
		</>
	);
}
function BudgetItems(props: destructuredExpenseYear) {
	const { outputRecurring, outputNonRecurring, annualExpense, monthlyExpense } = props;
	return (
		<>
			<RowGroup group={outputRecurring} />
			<RowGroup group={outputNonRecurring} />
			<Row key={"monthly expense row"} {...monthlyExpense} />
			<Row key={"annual expense row"} {...annualExpense} />
		</>
	);
}

function Taxes(props: destructuredTaxAccumulator) {
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

	const taxOutput = (
		<>
			<Row key={"federal income tax"} name={"Federal Income Tax"} note={""} amounts={federal} />
			<Row key={"federal income "} name={"Federal Income "} note={""} amounts={federalIncome} />
			<Row key={"capital gains tax"} name={"Capital Gains Tax"} note={""} amounts={capitalGains} />
			<Row key={"fica tax"} name={"FICA Tax"} note={""} amounts={fica} />
			<Row key={"state income tax"} name={"State Income Tax"} note={""} amounts={state} />
			<Row key={"Local Income Tax"} name={"Local Income Tax"} note={""} amounts={local} />
		</>
	);
	return taxOutput;
}
function YearlyIncomes(props: destructuredIncomeYear) {
	const { outRental, outOneTime, outHuman, outSocial, outNonTaxable, taxes } = props;
	return (
		<>
			<Row key={"outSocial"} {...outSocial} />
			<Row key={"outHuman"} {...outHuman} />
			<Row key={"outNonTaxable"} {...outNonTaxable} />
			<Row key={"outRental"} {...outRental} />
			<Row key={"outOneTime"} {...outOneTime} />
			{taxes != undefined ? <Taxes {...taxes} /> : null}
		</>
	);
}

function YearlyWithdrawals(props: destructuredWithdrawal) {
	const { outDividend, outputWithdrawal } = props;
	return (
		<>
			<RowGroup group={outDividend} />
			<WithdrawalRowGroup group={outputWithdrawal} />
		</>
	);
}

export function MacroYear(props: destructuredMacroYearReport) {
	const { expenses, incomes, withdrawals, deficit } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<Container>
			<Table responsive>
				<thead>
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
					{deficit != undefined ? <Row key={"deficit row"} {...deficit} /> : null}
					{withdrawals != undefined ? <YearlyWithdrawals {...withdrawals} /> : null}
				</tbody>
			</Table>
		</Container>
	);
}
