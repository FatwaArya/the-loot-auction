import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { itemsRouter } from "./items";
import { userRouter } from "./user";

export const appRouter = router({
  items : itemsRouter,
  example: exampleRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
