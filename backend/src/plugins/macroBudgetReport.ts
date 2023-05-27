import { FastifyInstance } from "fastify";
import { BudgetItem, Recurrence } from "../db/entities/budgetItem.js";
import { CapAsset } from "../db/entities/capasset.js";
import { Dividend } from "../db/entities/Dividend.js";
import { RentalAsset } from "../db/entities/rentalasset.js";
import { FinancialAsset } from "../db/entities/financialasset.js";
import { OneTimeIncome } from "../db/entities/OneTimeIncome.js";
import fp from "fastify-plugin";
import exp from "constants";
import budgetItemRoutes from "../routes/budgetItemRoutes.js";
import { Collection } from "@mikro-orm/core";
import { User } from "../db/entities/User.js";
import { OneTimeIncomeSeeder } from "../db/seeders/OneTimeIncomeSeeder.js";
import {TaxItem} from "../db/entities/Tax.js";

declare module "fastify" {
	interface FastifyInstance {
		expenseYearOutput: (
			expenses: Array<BudgetItem>,
			year: number
		) => { outputRecurring; outputNonRecurring; monthlyExpense: number; annualExpense: number };
		incomeYearOutput: (
			capitalIncomes: Array<CapAsset>,
			rentalIncome: Array<RentalAsset>,
			dividends: Array<Dividend>,
			finAssets: Array<FinancialAsset>,
			oneTime: Array<OneTimeIncome>,
			year: number
		) => { outCapital: number; outDividend: number; outOneTime: number; outRental: number };
		withdrawalYearOutput: (
			finAssets: Array<FinancialAsset>,
			difference: number
		) => { outputWithdrawals; updatedFinAssets: Array<FinancialAsset> };
		macroYearOutput: (expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		rentals: Array<RentalAsset>,
		year: number
		) => {toReturn}
	}
}

function calculateTax(income: number, number: number, number2: number, number3: number) {
	return income*(number+number2+number3);
}

const macroBudgetReport = async (app: FastifyInstance, _options = {}) => {
	const inflation: number = 1.025;
	function compoundGrowthRate(value: number, rate: number, difference: number) {
		return value * Math.pow(rate * inflation, difference);
	}

	function annualExpenseCalculation(item: BudgetItem, year: number, expense: number) {
		let monthsActive = 12;
		if (item.start.getFullYear() < year && item.end.getFullYear() > year)
			return monthsActive * expense;
		if (item.start.getFullYear() == year) monthsActive -= item.start.getMonth();
		if (item.end.getFullYear() == year) monthsActive -= 11 - item.end.getMonth();

		return monthsActive * expense;
	}

	function incomeCalculation(item: CapAsset, year: number) {
		let income: number;
		switch (item.recurrence) {
			case Recurrence.DAILY:
				income = item.income * 365;
				break;
			case Recurrence.WEEKLY:
				income = item.income * 52;
				break;
			case Recurrence.MONTHLY:
				income = item.income * 12;
				break;
			case Recurrence.ANNUALLY:
				income = item.income;
				break;
			case Recurrence.NON:
				income = item.income;
				break;
		}
		//need to get inflation amount from api and add to growth rate
		income = compoundGrowthRate(income, item.growthRate, year - item.start.getFullYear());
		const tax = calculateTax(
			income,
			item.federal == null ? 0 : item.federal.rate,
			item.state == null ? 0 : item.state.rate,
			item.local == null ? 0 : item.local.rate
		);
		return { income, tax };
	}

	function rentalCalculation(item: RentalAsset, year: number) {
		const income = compoundGrowthRate(
			item.grossIncome - item.maintenanceExpense,
			item.growthRate,
			year - item.created_at.getFullYear()
		);
		const tax = calculateTax(
			income,
			item.federal == null ? 0 : item.federal.rate,
			item.state == null ? 0 : item.state.rate,
			item.local == null ? 0 : item.local.rate
		);
		return { income, tax };
	}

	function calculatePostTaxLiquidity(item: FinancialAsset) {
		return item.totalValue;
	}

	function calculateWithdrawal(item: FinancialAsset, difference: number) {
		return difference;
	}
	const expenseCalculation = (item: BudgetItem, year: number) => {
		let expense: number;
		switch (item.recurrence) {
			case Recurrence.DAILY:
				expense = item.amount * 30.437;
				break;
			case Recurrence.WEEKLY:
				expense = item.amount * 4.3;
				break;
			case Recurrence.MONTHLY:
				expense = item.amount;
				break;
			case Recurrence.ANNUALLY:
				expense = item.amount / 12;
				break;
			case Recurrence.NON:
				expense = item.amount;
				break;
		}
		//need to get inflation amount from api and add to growth rate
		return compoundGrowthRate(expense, item.growthRate, year - item.created_at.getFullYear());
	};
	//Provided with collection of budget items for given year provided
	const expenseYearOutput = (expenses: Array<BudgetItem>, year: number) => {
		const outputRecurring = {},
			outputNonRecurring = {};
		let monthlyExpense = 0;
		let annualExpense = 0;

		expenses
			.filter((x) => x.recurrence != Recurrence.NON)
			.forEach((x) => {
				outputRecurring[x.name] = { note: x.note, amount: expenseCalculation(x, year) };
				monthlyExpense += outputRecurring[x.name].amount;
				annualExpense += annualExpenseCalculation(x, year, outputRecurring[x.name].amount);
			});

		expenses
			.filter((x) => x.recurrence == Recurrence.NON)
			.forEach((x) => {
				outputNonRecurring[x.name] = { note: x.note, amount: expenseCalculation(x, year) };
				annualExpense += outputNonRecurring[x.name].amount;
			});

		return { outputRecurring, outputNonRecurring, monthlyExpense, annualExpense };
	};

	app.decorate("expenseYearOutput", expenseYearOutput);

	//assume rental income is update for withdrawals from previous years in array of assets passed in/
	// assumption remains the same for fin assets used to calculate dividends
	// needs to also return the amount paid in taxes for each income stream
	const incomeYearOutput = (
		capitalIncomes: Array<CapAsset>,
		rentalIncome: Array<RentalAsset>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		oneTime: Array<OneTimeIncome>,
		year: number
	) => {
		let outCapital: number = 0;
		let outRental: number = 0;
		let outDividend: number = 0;
		let outOneTime: number = 0;
		let taxes: number = 0;

		capitalIncomes.forEach((x) => {
			const toAdd = incomeCalculation(x, year);
			outCapital += toAdd.income;
			taxes += toAdd.tax;
		});

		rentalIncome.forEach((x) => {
			const toAdd = rentalCalculation(x, year);
			outRental += toAdd.income;
			taxes += toAdd.tax;
		});

		//where is dividend number coming from?
		//fix for pulling asset id from relation to dividend
		// console.log(finAssets);
		dividends.forEach((x) => {
			const value = finAssets.find((y) => y.id == x.asset.id);
			const income = x.rate * value.totalValue;
			outDividend += income;
			taxes += calculateTax(
				income,
				x.federal == null ? 0 : x.federal.rate,
				x.state == null ? 0 : x.state.rate,
				x.local == null ? 0 : x.local.rate
			);
		});

		oneTime.forEach((x) => {
			const income = compoundGrowthRate(x.cashBasis, 1, year - x.created_at.getFullYear());
			outOneTime += income;
			taxes += calculateTax(
				income,
				x.federal == null ? 0 : x.federal.rate,
				x.state == null ? 0 : x.state.rate,
				x.local == null ? 0 : x.local.rate
			);
		});

		return { outCapital, outRental, outDividend, outOneTime, taxes};
	};

	app.decorate("incomeYearOutput", incomeYearOutput);

	//update finAssets to be current with growth
	//create object with the amount withdrawn from each account
	//return new array of finAssets with updated amount fields
	const withdrawalYearOutput = (finAssets: Array<FinancialAsset>, difference: number) => {
		const outputWithdrawals = new Object();

		finAssets
			.sort((a, b) => a.wPriority - b.wPriority)
			.filter((x) => x.totalValue > 0)
			.forEach((x) => {
				const toAdd = x;
				toAdd.totalValue = compoundGrowthRate(toAdd.totalValue, toAdd.growthRate, 1);
				if (difference < 0) {
					toAdd.totalValue -= difference;
					toAdd.costBasis -= difference;
					outputWithdrawals[toAdd.name] = { deposit: -difference };
					difference = 0;
				} else if (difference > 0) {
					const postTaxLiquidity = calculatePostTaxLiquidity(toAdd);
					if (postTaxLiquidity <= difference) {
						toAdd.totalValue = 0;
						toAdd.costBasis = 0;
						difference -= postTaxLiquidity;
						outputWithdrawals[toAdd.name] = { withdrawal: postTaxLiquidity };
					} else {
						const withdrawal = calculateWithdrawal(toAdd, difference);
						difference = 0;
						outputWithdrawals[toAdd.name] = { withdrawal: withdrawal };
						toAdd.totalValue -= withdrawal;
					}
				}
			});

		return { outputWithdrawals};
	};

	app.decorate("withdrawalYearOutput", withdrawalYearOutput);

	const macroYearOutput = (
		expenses: Array<BudgetItem>,
		capitalAssets: Array<CapAsset>,
		dividends: Array<Dividend>,
		finAssets: Array<FinancialAsset>,
		oneTimeIncomes: Array<OneTimeIncome>,
		rentals: Array<RentalAsset>,
		year: number
	) => {
		const toReturn = new Object();
		let deficit = 0;
		const expense = expenseYearOutput(expenses, year);
		Object.getOwnPropertyNames(expense).forEach((key) => (toReturn[key] = expense[key]));
		const income = incomeYearOutput(
			capitalAssets,
			rentals,
			dividends,
			finAssets,
			oneTimeIncomes,
			year
		);
		Object.getOwnPropertyNames(income).forEach((key) => {
			toReturn[key] = income[key];
			if (key !== "taxes") deficit -= income[key];
			else deficit += income[key];
		});
		toReturn["deficit"]=-deficit;
		const withdrawal = withdrawalYearOutput(finAssets, deficit);
		Object.getOwnPropertyNames(withdrawal).forEach((key) => (toReturn[key] = withdrawal[key]));
		return {...toReturn };
	};

	app.decorate("macroYearOutput", macroYearOutput);
};

export const FastifyMacroReportsPlugin = fp(macroBudgetReport, {
	name: "macroBudgetReport",
});
