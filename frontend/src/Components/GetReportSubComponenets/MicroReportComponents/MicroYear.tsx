import { Container, Row, Table } from "react-bootstrap";
import React from "react";
import {
	DestructuredMicroExpense,
	DestructuredMicroIncome,
	DestructuredMicroOutputRow,
	DestructuredMicroReport,
	DestructuredMicroTaxAccumulator,
	DestructuredMicroWithdrawal,
	DestructuredMicroWithdrawalOutputRow,
} from "../../../../destructureTypes.ts";

export type microRowGroup = {
	group: Array<[number, DestructuredMicroOutputRow]>;
};

export type microRow = DestructuredMicroOutputRow & {
	id: number;
	type?: string;
};

export type microWithRow = DestructuredMicroWithdrawalOutputRow & {
	id: number;
};

function MicroRow(props: microRow) {
	const { name, note, amounts, id, type } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});
	function getClass(item: string): string {
		switch (item) {
			case "sum":
				return "table-sheet heading sum";
			case "heading":
				return "table-sheet heading";
			case "bad":
				return "table-sheet heading sum bad";
			default:
				return "table-sheet";
		}
	}
	return (
		<tr>
			<td className={getClass(type)} key={name + "cell"}>
				{name}
			</td>
			<td key={note + "cell"}>{name == "remainder" ? "" : note}</td>
			{amounts.map(([[month, year], x]) => (
				<td
					className={`${type == "sum" ? "sum" : ""} ${type == "bad" ? "sum bad" : ""}`}
					key={id.toString() + year.toString() + month.toString() + name + note + "cell"}>
					{formater.format(x)}
				</td>
			))}
		</tr>
	);
}

function Remainder(props: DestructuredMicroOutputRow) {
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
				return (
					<td key={year.toString() + month.toString() + name + note + "cell"}>
						{formater.format(x)}
					</td>
				);
			})}
		</tr>
	);
}

function MicroRowGroup(props: microRowGroup) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([id, value]) => <MicroRow key={value.name + id + "row"} {...value} id={id} />)
				: null}
		</>
	);
}

function MicroWithdrawalRow(props: microWithRow) {
	const { name, note, updatedValue, id } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});
	return (
		<tr>
			<td key={name + "withdrawal"}>{name}</td>
			<td key={note + "withdrawal"}>{note}</td>
			{updatedValue.map(([[month, year], x]) => (
				<td key={id.toString() + year.toString() + month.toString() + name + note + "withdrawal"}>
					{formater.format(x)}
				</td>
			))}
		</tr>
	);
}

function MicroWithdrawalRowGroup(props: {
	group: [number, DestructuredMicroWithdrawalOutputRow][];
}) {
	const { group } = props;
	return (
		<>
			{group != undefined
				? group.map(([key, value]) => <MicroRow key={value.name} {...value} id={key} />)
				: null}
			{group != undefined
				? group.map(([key, value]) => (
						<MicroWithdrawalRow key={value.name + "withdrawal row"} {...value} id={key} />
				  ))
				: null}
		</>
	);
}
function BudgetItems(props: DestructuredMicroExpense) {
	const { outRecurring, outNonRecurring } = props;
	return (
		<>
			<MicroRow type={"heading"} {...outRecurring} id={1} />
			<MicroRow type={"heading"} {...outNonRecurring} id={2} />
		</>
	);
}

function Taxes(props: DestructuredMicroTaxAccumulator) {
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
				id={1}
			/>
			<MicroRow
				key={"capital gains taxable income"}
				name={"Taxable Income - Capital Gains"}
				note={""}
				amounts={capitalGainsIncome}
				id={1}
			/>
			<MicroRow
				key={"fica taxable income"}
				name={"Taxable Income - FICA Tax"}
				note={""}
				amounts={ficaIncome}
				id={1}
			/>
			<MicroRow
				key={"state taxable income"}
				name={"Taxable Income - State"}
				note={""}
				amounts={stateIncome}
				id={1}
			/>
			<MicroRow
				key={"Local taxable income"}
				name={"Taxable Income - Local"}
				note={""}
				amounts={localIncome}
				id={1}
			/>
			<MicroRow
				key={"federal income tax"}
				name={"Federal Income Tax"}
				note={""}
				amounts={federal}
				id={1}
			/>
			<MicroRow
				key={"capital gains tax"}
				name={"Capital Gains Tax"}
				note={""}
				amounts={capitalGains}
				id={1}
			/>
			<MicroRow key={"fica tax"} name={"FICA Tax"} note={""} amounts={ficaIncome} id={1} />
			<MicroRow
				key={"state income tax"}
				name={"State Income Tax"}
				note={""}
				amounts={stateIncome}
				id={1}
			/>
			<MicroRow
				key={"Local Income Tax"}
				name={"Local Income Tax"}
				note={""}
				amounts={localIncome}
				id={1}
			/>
		</>
	);
	return taxOutput;
}

function MicroIncomes(props: DestructuredMicroIncome) {
	const { salary, investments, retirementIncome, nonTaxable, oneTimeIncome, taxes, monthlyIncome } =
		props;
	return (
		<>
			<MicroRowGroup key={"salary"} group={salary} />
			<MicroRowGroup key={"investments"} group={investments} />
			<MicroRowGroup key={"retirementIncome"} group={retirementIncome} />
			<MicroRowGroup key={"nonTaxable"} group={nonTaxable} />
			<MicroRowGroup key={"outOneTime"} group={oneTimeIncome} />
			<MicroRow type={"sum"} key={"Monthly Sum"} {...monthlyIncome} id={1} />
			{taxes != undefined ? <Taxes {...taxes} /> : null}
		</>
	);
}

function MicroWithdrawals(props: DestructuredMicroWithdrawal) {
	const { outDividend, outputWithdrawal, remainder } = props;
	return (
		<>
			<MicroRowGroup group={outDividend} />
			<MicroWithdrawalRowGroup group={outputWithdrawal} />
			{remainder != undefined && remainder.note != "" ? (
				<MicroRow type={"bad"} {...remainder} id={1} />
			) : null}
		</>
	);
}

export function MicroYear(props: DestructuredMicroReport) {
	const { expense, income, withdrawal, deficit } = props;
	const formater = new Intl.NumberFormat("em-US", {
		style: "currency",
		currency: "USD",
	});

	return (
		<Container className={"bg-light rounded-4 m-5 p-5"}>
			<Row className={"text-center pb-2"}>
				<h1>Monthly CashFlow Estimate</h1>
				{withdrawal != undefined && withdrawal.remainder.note != "" ? (
					<div className={" text-center p-2 h5 border border-danger border-4 rounded text-danger"}>
						{"WIll RUN OUT OF MONEY " + JSON.parse(withdrawal.remainder.note)}
					</div>
				) : null}
			</Row>
			<div className={"overflow-auto report"}>
				<Table className={"border-dark table-sheet"} striped bordered hover>
					<thead className={"table-dark border-white"}>
						<tr>
							<th scope={"col"} className={"table-sheet sticky"}>
								Name
							</th>
							<th scope={"col"} className={"table-sheet sticky"}>
								Note
							</th>
							{expense != undefined
								? expense.outNonRecurring.amounts.map(([[month, year]]) => (
										<th
											scope={"col"}
											className={"table-sheet sticky"}
											key={"header-name-note" + month + year + "cell"}>{`${month + 1}/${year}`}</th>
								  ))
								: null}
						</tr>
					</thead>
					<tbody>
						{expense != undefined ? <BudgetItems {...expense} /> : null}
						{income != undefined ? <MicroIncomes {...income} /> : null}
						{deficit != undefined ? (
							<MicroRow type={"sum"} key={"deficit row"} {...deficit} id={1} />
						) : null}
						{withdrawal != undefined ? <MicroWithdrawals {...withdrawal} /> : null}
					</tbody>
				</Table>
			</div>
		</Container>
	);
}
