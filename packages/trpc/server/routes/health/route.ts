import {publicProcedure, router} from '../../trpc';
import {z,zodUndefinedModel} from '../../schema';


export const healthRouter = router({
    getHealth: publicProcedure
    .meta({openapi:{method:"GET",path:"/health"}})
    .input(zodUndefinedModel)
    .output(
        z.object({
            status:z.literal("healthy").describe("server status")
        })
    )
    .query(async()=>{
        return {
            status:"healthy"
        }
    })
})