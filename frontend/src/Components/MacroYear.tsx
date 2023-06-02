import {
	destructuredExpenseYear,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredOutputRow,
	destructuredWithdrawal,
	destructuredWithOutputRow,
	expenseYear,
	incomeYear,
	macroYearReport,
	outputRow,
	row,
	taxAccumulator,
	withdrawal,
} from "../../../backend/src/db/types.js";
import { Container, Table } from "react-bootstrap";
import React from "react";

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
			<td key={name}>{name}</td>
			<td key={note}>{note}</td>
			{amounts.map(([, x]) => (
				<td key={x + name + note}>{formater.format(x)}</td>
			))}
		</tr>
	);
}
function RowGroup(props: rowGroup) {
	const { group } = props;
	return (
		<>
			{group != undefined ? group.map(([key, value]) => <Row key={value.name} {...value} />) : null}
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
			<td key={name}>{name}</td>
			<td key={note}>{note}</td>
			{updatedValue.map(([, x]) => (
				<td key={x + name + note}>{formater.format(x)}</td>
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
				? group.map(([key, value]) => <WithdrawalRow key={value.name} {...value} />)
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
			<Row {...monthlyExpense} />
			<Row {...annualExpense} />
		</>
	);
}

function YearlyIncomes(props: destructuredIncomeYear) {
	const { outRental, outOneTime, outHuman, outSocial, outNonTaxable, taxes } = props;
	return (
		<tbody>
			<Row {...outSocial} />
			<Row {...outHuman} />
			<Row {...outNonTaxable} />
			<Row {...outRental} />
			<Row {...outOneTime} />
		</tbody>
	);
}

function YearlyWithdrawals(props: destructuredWithdrawal) {
	const { outDividend, outputWithdrawal } = props;
	return (
		<tbody>
			<RowGroup group={outDividend} />
			<WithdrawalRowGroup group={outputWithdrawal} />
		</tbody>
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
				{expenses != undefined ? <BudgetItems {...expenses} /> : null}
				{incomes != undefined ? <YearlyIncomes {...incomes} /> : null}
				{withdrawals != undefined ? <YearlyWithdrawals {...withdrawals} /> : null}
			</Table>
		</Container>
	);
}
