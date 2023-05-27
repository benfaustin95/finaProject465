import {FastifyInstance} from "fastify";
import {User} from "../db/entities/User.js";
import exp from "constants";
import {BudgetItem} from "../db/entities/budgetItem.js";


async function macroReportRoutes  (app:FastifyInstance, options ={}) {
   if(!app)
       throw new Error("app error macro report routes");

   app.search<{Body:{email: string, start: Date, end:Date}}>("/macroReport", async (req, reply) =>{
     let {email, start, end} = req.body;
     const toSendBudget = new Object();
     try{
         const user = await req.em.findOneOrFail(User, {email},
             {populate:['budgetItems', 'financialAssets', 'capitalAssets','rentalAssets','dividends','oneTimeIncomes']});

         start = new Date(start);
         end = new Date(end);
         for(let year = start.getFullYear(); year <= end.getFullYear(); ++year){
             toSendBudget[year] = app.expenseYearOutput(user.budgetItems.getItems().filter(x =>
                 x.start.getFullYear() <= year && x.end.getFullYear() >= year), year);
         }
         reply.send(toSendBudget);

     }catch(err){
         console.log(err);
         reply.status(500).send(err);
     }
   });
}


export default macroReportRoutes;