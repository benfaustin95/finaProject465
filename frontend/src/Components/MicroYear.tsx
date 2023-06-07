import {
	destructuredExpenseMonth,
	destructuredExpenseYear,
	destructuredIncomeMonth,
	destructuredIncomeYear,
	destructuredMacroYearReport,
	destructuredMicroReport,
	destructuredMicroWithdrawal,
	destructuredMonthlyTaxAccumulator,
	destructuredMonthOutputRow,
	destructuredOutputRow,
	destructuredTaxAccumulator,
	destructuredWithdrawal,
	destructuredWithdrawalMonthOutputRow,
	destructuredWithOutputRow,
	taxAccumulator,
	withdrawal,
} from "../../../backend/src/db/types.js";
import { Container, Row, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Simulate } from "react-dom/test-utils";
import waiting = Simulate.waiting;

export type microRowGroup = {
	group: Array<[number, destructuredMonthOutputRow]>;
};

function MicroRow(props: destructuredMonthOutputRow) {
	const { name, note, amounts } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<tr>
			<td key={name + "cell"}>{name}</td>
			<td key={note + "cell"}>{note}</td>
			{amounts.map(([[month, year], x]) => (
				<td key={year + month + name + note + "cell"}>{formater.format(x)}</td>
			))}
		</tr>
	);
}

function Remainder(props: destructuredMonthOutputRow) {
	const { name, note, amounts } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<tr>
			<td key={name + "cell"}>{name}</td>
			<td key={note + "cell"}>{note}</td>
			{amounts.map(([[month, year], x]) => {
				return <td key={year + month + name + note + "cell"}>{formater.format(x)}</td>;
			})}
		</tr>
	);
}

function MicroRowGroup(props: microRowGroup) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([key, value]) => <MicroRow key={value.name + key + "row"} {...value} />)
				: null}
		</>
	);
}

function MicroWithdrawalRow(props: destructuredWithdrawalMonthOutputRow) {
	const { name, note, amounts, updatedValue } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});
	return (
		<tr>
			<td key={name + "withdrawal"}>{name}</td>
			<td key={note + "withdrawal"}>{note}</td>
			{updatedValue.map(([[month, year], x]) => (
				<td key={year + month + name + note + "withdrawal"}>{formater.format(x)}</td>
			))}
		</tr>
	);
}

function MicroWithdrawalRowGroup(props: {
	group: [number, destructuredWithdrawalMonthOutputRow][];
}) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([key, value]) => <MicroRow key={value.name} {...value} />)
				: null}
			{group != undefined
				? group.map(([key, value]) => (
						<MicroWithdrawalRow key={value.name + "withdrawal row"} {...value} />
				  ))
				: null}
		</>
	);
}
function BudgetItems(props: destructuredExpenseMonth) {
	const { outRecurring, outNonRecurring } = props;
	return (
		<>
			<MicroRow {...outRecurring} />
			<MicroRow {...outNonRecurring} />
		</>
	);
}

function Taxes(props: destructuredMonthlyTaxAccumulator) {
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
			<MicroRow
				key={"federal taxable income"}
				name={"Taxable Income - Federal"}
				note={""}
				amounts={federalIncome}
			/>
			<MicroRow
				key={"capital gains taxable income"}
				name={"Taxable Income - Capital Gains"}
				note={""}
				amounts={capitalGainsIncome}
			/>
			<MicroRow
				key={"fica taxable income"}
				name={"Taxable Income - FICA Tax"}
				note={""}
				amounts={ficaIncome}
			/>
			<MicroRow
				key={"state taxable income"}
				name={"Taxable Income - State"}
				note={""}
				amounts={stateIncome}
			/>
			<MicroRow
				key={"Local taxable income"}
				name={"Taxable Income - Local"}
				note={""}
				amounts={localIncome}
			/>
			<MicroRow
				key={"federal income tax"}
				name={"Federal Income Tax"}
				note={""}
				amounts={federal}
			/>
			<MicroRow
				key={"capital gains tax"}
				name={"Capital Gains Tax"}
				note={""}
				amounts={capitalGains}
			/>
			<MicroRow key={"fica tax"} name={"FICA Tax"} note={""} amounts={ficaIncome} />
			<MicroRow
				key={"state income tax"}
				name={"State Income Tax"}
				note={""}
				amounts={stateIncome}
			/>
			<MicroRow
				key={"Local Income Tax"}
				name={"Local Income Tax"}
				note={""}
				amounts={localIncome}
			/>
		</>
	);
	return taxOutput;
}

function FillerRow(props: { name: string }) {
	const { name } = props;
	return (
		<tr>
			<td>{name}</td>
		</tr>
	);
}

function MicroIncomes(props: destructuredIncomeMonth) {
	const { salary, investments, retirementIncome, nonTaxable, oneTimeIncome, taxes, monthlyIncome } =
		props;
	return (
		<>
			{/*<FillerRow name={"Income/Disbursements - by source"} />*/}
			{/*<FillerRow name={"Salary"} />*/}
			<MicroRowGroup key={"salary"} group={salary} />
			{/*<FillerRow name={"Investments"} />*/}
			<MicroRowGroup key={"investments"} group={investments} />
			{/*<FillerRow name={"Retirement Income"} />*/}
			<MicroRowGroup key={"retirementIncome"} group={retirementIncome} />
			{/*<FillerRow name={"Non-Tax Assets"} />*/}
			<MicroRowGroup key={"nonTaxable"} group={nonTaxable} />
			{/*<FillerRow name={"One Time Incomes"} />*/}
			<MicroRowGroup key={"outOneTime"} group={oneTimeIncome} />
			<MicroRow key={"Monthly Sum"} {...monthlyIncome} />
			{taxes != undefined ? <Taxes {...taxes} /> : null}
		</>
	);
}

function MicroWithdrawals(props: destructuredMicroWithdrawal) {
	const { outDividend, outputWithdrawal, remainder } = props;
	return (
		<>
			<MicroRowGroup group={outDividend} />
			<MicroWithdrawalRowGroup group={outputWithdrawal} />
			{remainder != undefined && remainder.amounts.filter((x) => x[1] != 0).length > 0 ? (
				<MicroRow {...remainder} />
			) : null}
		</>
	);
}

export function MicroYear(props: destructuredMicroReport) {
	const { expense, income, withdrawal, deficit } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<Container className={"bg-light rounded-4 m-5 p-5"}>
			<Row className={"text-center pb-4"}>
				<h1>Monthly CashFlow Estimate</h1>
			</Row>
			<Table className={"border-dark"} responsive striped bordered hover>
				<thead className={"table-dark border-white"}>
					<tr>
						<th>Name</th>
						<th>Note</th>
						{expense != undefined
							? expense.outNonRecurring.amounts.map(([[month, year]]) => (
									<th key={"header-name-note" + month + year + "cell"}>{`${month + 1}/${year}`}</th>
							  ))
							: null}
					</tr>
				</thead>
				<tbody>
					{expense != undefined ? <BudgetItems {...expense} /> : null}
					{income != undefined ? <MicroIncomes {...income} /> : null}
					{deficit != undefined ? <MicroRow key={"deficit row"} {...deficit} /> : null}
					{withdrawal != undefined ? <MicroWithdrawals {...withdrawal} /> : null}
				</tbody>
			</Table>
		</Container>
	);
}
