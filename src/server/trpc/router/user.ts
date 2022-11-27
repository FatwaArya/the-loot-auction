import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
    updateRole: protectedProcedure
        .input(z.object({ id: z.string(), role:z.enum(["USER", "MERCHANT"]) }))
        .mutation(({ input, ctx }) => {
            return ctx.prisma.user.update({
                where: {
                    id: input.id,
                },
                data: {
                    role: input.role,
                },
            });
        }
        ),
    me: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.user.findUnique({
            where: {
                id: ctx?.session?.user?.id,
            },
        });
    }
    ),
});


