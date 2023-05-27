import {FastifyInstance} from "fastify";


async function microReportRoutes (app:FastifyInstance, options ={}){
   if(!app) throw new Error("microreport bad");

   //monthly spend
   //income disbursment by source
   // cap assets pretty easy
   // rental income pretty easy
   // Dividends (when are they disbursed/ do I need to add a disbursement date to entity)
   //
}