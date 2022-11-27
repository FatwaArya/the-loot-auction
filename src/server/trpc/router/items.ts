import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const itemsRouter = router({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.merchantItems.findMany();
    }
    ),
    getOne: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ input, ctx }) => {
            return ctx.prisma.merchantItems.findUnique({
                where: {
                    id: input.id,
                },
            });
        }
        ),
    // create: publicProcedure
    //     .input(z.object({ name: z.string(), description: z.string(), price: z.number() }))
    //     .mutation(({ input, ctx }) => {
    //         return ctx.prisma.items.create({
    //             data: {
    //                 itemName: input.name,
    //                 description: input.description,
    //                 price: input.price,
    //             },
    //         });
    //     }
    //     ),
    update: publicProcedure
        .input(z.object({ id: z.string(), name: z.string(), description: z.string(), price: z.number() }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.merchantItems.update({
                where: {
                    id: input.id,
                },
                data: {
                    itemName: input.name,
                    description: input.description,
                    price: input.price,
                },
            });
        }
        ),
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.merchantItems.delete({
                where: {
                    id: input.id,
                },
            });
        }
        ),
    newItems: protectedProcedure.input(z.object({
            name: z.string(), 
            description: z.string(),
            price: z.number(),
            quantity: z.number(),
            image: z.string(),
            merchantId: z.string().nullish(),
            }))
        .mutation(({ input, ctx }) => {
            // use supabase to upload image
            return ctx.prisma.merchantItems.create({
                data: {
                    itemName: input.name,
                    description: input.description,
                    price: input.price,
                    quantity: input.quantity,
                    status: "AVAILABLE",
                    userId: input.merchantId,
                    image: input.image,
                },
                
            });
        }),
    merchantItems: protectedProcedure.input(z.object({
        //undefined merchantId
        merchantId: z.string()
    }))
    .query(({ input, ctx }) => {
        return ctx.prisma.merchantItems.findMany({
            where: {
                userId: input.merchantId,
            },
        });
    }
    ),
       
       
});
