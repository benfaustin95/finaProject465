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
} from "../../../../backend/src/db/types.js";
import { Container, Row, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Simulate } from "react-dom/test-utils";
import waiting = Simulate.waiting;

export type rowGroup = {
	group: Array<[number, destructuredOutputRow]>;
};

function OutputRow(props: destructuredOutputRow) {
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
				? group.map(([key, value]) => <OutputRow key={value.name + "row"} {...value} />)
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
function BudgetItems(props: destructuredExpenseYear) {
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
	return taxOutput;
}
function YearlyIncomes(props: destructuredIncomeYear) {
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

function YearlyWithdrawals(props: destructuredWithdrawal) {
	const { outDividend, outputWithdrawal, remainder } = props;
	return (
		<>
			<RowGroup group={outDividend} />
			<WithdrawalRowGroup group={outputWithdrawal} />
			{remainder != undefined && remainder.amounts.filter((x) => x[1] != 0).length > 0 ? (
				<OutputRow key={"remainder"} {...remainder} />
			) : null}
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
				{withdrawals != undefined ? <YearlyWithdrawals {...withdrawals} /> : null}
			</tbody>
		</Table>
	);
}
