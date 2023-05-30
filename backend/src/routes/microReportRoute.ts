import {FastifyInstance} from "fastify";
import {User} from "../db/entities/User.js";


async function microReportRoutes (app:FastifyInstance, options ={}){
   if(!app) throw new Error("microreport bad");

   app.search<{Body: {email: string}}>("/microReport", async (req, reply) => {
      const {email} = req.body;
      try {
         const user = await req.em.findOneOrFail(
             User,
             {email},
             {
                populate: [
                   "budgetItems",
                   "financialAssets",
                   "capitalAssets",
                   "rentalAssets",
                   "dividends",
                   "oneTimeIncomes",
                ],
             }
         );

         const rentalAssets = user.rentalAssets.getItems();
         const finAssets = user.financialAssets.getItems();
         const dividends = user.dividends.getItems();
         const budgetItems = user.budgetItems.getItems();
         const capAssets = user.capitalAssets.getItems()
         const oneTimeIncome = user.oneTimeIncomes.getItems()

         // for(let year = user.start.getFullYear(); year<=user.start.getFullYear()+5;++year){
         const year = user.start.getFullYear();
            const toSendBudget = app.microYearReport(
                budgetItems.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
                capAssets.filter((x) => x.start.getFullYear() <= year && x.end.getFullYear() >= year),
                oneTimeIncome.filter((x) => x.date.getFullYear() === year),
                dividends,
                finAssets,
                rentalAssets,
                year
            );
         reply.send(toSendBudget);
      }
      catch (err){
         reply.status(500).send(err);
      }
   });
}

export default microReportRoutes;