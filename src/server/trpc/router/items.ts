import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";
export const itemsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.merchantItems.findMany({
      where: {
        status: "AVAILABLE",
      },
    });
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.merchantItems.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.merchantItems.delete({
        where: {
          id: input.id,
        },
      });
    }),
  newItems: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
        merchantId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      // use supabase to upload image
      return ctx.prisma.merchantItems.create({
        data: {
          itemName: input.name,
          description: input.description,
          price: input.price,
          status: "AVAILABLE",
          userId: input.merchantId,
          image: input.image,
        },
      });
    }),
  merchantItems: protectedProcedure
    .input(
      z.object({
        //undefined merchantId
        merchantId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.merchantItems.findMany({
        where: {
          userId: input.merchantId,
        },
      });
    }),
  biddingItems: protectedProcedure
    .input(
      z.object({
        merchantItemId: z.string(),
        bidAmount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.prisma.merchantItems.findUnique({
        where: {
          id: input.merchantItemId,
        },
      });

      const currAmount = await ctx.prisma.itemsBidders.findMany({
        where: {
          merchantItemsId: input.merchantItemId,
        },
        orderBy: {
          bidAmount: "desc",
        },
        take: 1,
      });

      //cant bid if item is not available
      if (item?.status !== "AVAILABLE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item is not available for bidding",
        });
      }
      //merchant cant bid on their own item
      if (item?.userId === ctx?.session?.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Merchant cannot bid on their own item",
        });
      }

      //cant bid if bid
      if (currAmount.length > 0) {
        if ((currAmount[0]?.bidAmount as number) >= input.bidAmount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bid amount must be higher than current bid",
          });
        }
      }

      return ctx.prisma.itemsBidders.create({
        data: {
          merchantItemsId: input.merchantItemId,
          bidderId: ctx?.session?.user?.id as string,
          bidAmount: input.bidAmount,
        },
      });
    }),
  // get last bid amount
  //to provide information to select winner
  lastBidAmount: protectedProcedure
    .input(
      z.object({
        merchantId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      //join table from merchantItem to itemBidders
      return ctx.prisma.merchantItems.findMany({
        where: {
          userId: input.merchantId,
        },
        include: {
          bidders: {
            orderBy: {
              bidAmount: "desc",
            },
            take: 1,
          },
        },
      });
    }),

  //select winner and update status using transaction
  //this endpoint will be use by the merchant
  //selectWinner || close auction
  selectWinner: protectedProcedure
    .input(
      z.object({
        merchantItemId: z.string(),
        bidderId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.ownedItems.create({
          data: {
            merchantItemsId: input.merchantItemId,
            userId: input.bidderId,
          },
        }),

        ctx.prisma.merchantItems.update({
          where: {
            id: input.merchantItemId,
          },
          data: {
            status: "SOLD",
          },
        }),
      ]);
    }),
  availableItems: protectedProcedure
    .input(
      z.object({
        merchantId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.merchantItems.findMany({
        where: {
          userId: input.merchantId,
          status: "AVAILABLE",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  soldItems: protectedProcedure
    .input(
      z.object({
        merchantId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.merchantItems.findMany({
        where: {
          userId: input.merchantId,
          status: "SOLD",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});
