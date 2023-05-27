//Provided with collection of budget items for given year provided
import {BudgetItem, Recurrence} from "../../db/entities/budgetItem.js";

const inflation: number = 1.025;
export function compoundGrowthRate(value: number, rate: number, difference: number) {
    return value * Math.pow(rate * inflation, difference);
}
export const expenseYearOutput = (expenses: Array<BudgetItem>, year: number) => {
    const outputRecurring = {},
        outputNonRecurring = {};
    let monthlyExpense = 0;
    let annualExpense = 0;

    expenses
        .forEach((x) => {
            if(x.recurrence != Recurrence.NON) {
                outputRecurring[x.name] = {note: x.note, amount: expenseCalculation(x, year)};
                monthlyExpense += outputRecurring[x.name].amount;
                annualExpense += annualExpenseCalculation(x, year, outputRecurring[x.name].amount);
            }
            else{
                outputNonRecurring[x.name] = { note: x.note, amount: expenseCalculation(x, year) };
                annualExpense += outputNonRecurring[x.name].amount;
            }
        });
    return {outputRecurring, outputNonRecurring, monthlyExpense, annualExpense };
};

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
function annualExpenseCalculation(item: BudgetItem, year: number, expense: number) {
    let monthsActive = 12;
    if (item.start.getFullYear() < year && item.end.getFullYear() > year)
        return monthsActive * expense;
    if (item.start.getFullYear() == year) monthsActive -= item.start.getMonth();
    if (item.end.getFullYear() == year) monthsActive -= 11 - item.end.getMonth();

    return monthsActive * expense;
}

