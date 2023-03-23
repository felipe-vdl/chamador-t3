import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import type { CurrentPassword } from "@prisma/client";

type PasswordInfo = Pick<CurrentPassword, "password" | "message">;

const passwordEmitter = new EventEmitter();

export const passwordRouter = createTRPCRouter({
  wsSubscription: publicProcedure.subscription(() => {
    return observable<PasswordInfo>((emit) => {
      const onCallPassword = (password: PasswordInfo) => {
        emit.next(password);
      };

      const onResetPasswords = () => {
        emit.next({ password: 1, message: "" });
      };

      passwordEmitter.on("call-password", onCallPassword);
      passwordEmitter.on("reset", onResetPasswords);

      return () => {
        passwordEmitter.off("call-password", onCallPassword);
        passwordEmitter.off("reset", onResetPasswords);
      };
    });
  }),
  newPassword: publicProcedure.mutation(async ({ ctx }) => {
    const newPassword = await ctx.prisma.password.create({ data: {} });
    
    /* Current Session */
    await ctx.prisma.sessionTotal.findFirst({
      orderBy: { id: "desc" }
    }).then(async session => {
      if (session) {
        await ctx.prisma.sessionTotal.update({
          where: { id: session.id },
          data: {
            quantity: { increment: 1 }
          }
        })
      }
    });

    return newPassword;
  }),
  currentPassword: publicProcedure.query(async ({ ctx }) => {
    const currentPassword = await ctx.prisma.currentPassword.findUnique({
      where: { id: 1 },
    });

    if (currentPassword) {
      return currentPassword;
    } else {
      throw new Error("A senha atual não existe na base de dados.");
    }
  }),
  callPassword: publicProcedure
    .input(
      z.object({
        message: z.string().optional(),
        password: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const password = await ctx.prisma.password.findUnique({
        where: { id: input.password },
      });
      if (password) {
        /* Update the Current Password */
        await ctx.prisma.currentPassword.update({
          where: { id: 1 },
          data: {
            password: input.password,
            message: input.message,
          },
        });
        passwordEmitter.emit("call-password", {
          password: input.password,
          message: input.message,
        });
        return { password: input.password, message: input.message }
      } else {
        throw new Error("A senha não existe.");
      }
    }),
  reset: publicProcedure.mutation(async ({ ctx }) => {
    /* Reset Current Password */
    await ctx.prisma.currentPassword.update({
      where: { id: 1 },
      data: { password: 1, message: "" },
    });

    const previousSession = await ctx.prisma.sessionTotal.findFirst({
      orderBy: { id: "desc" }
    });
    
    if (previousSession) {
      /* Close the last Session */
      await ctx.prisma.sessionTotal.update({
        where: { id: previousSession.id },
        data: {
          closedAt: new Date(),
        }
      });
    }

    /* Create a New Session */
    await ctx.prisma.sessionTotal.create({
      data: {
        quantity: 0,
        updatedAt: null,
        closedAt: null
      }
    });

    await ctx.prisma.password.deleteMany({});
    await ctx.prisma.$queryRaw`TRUNCATE TABLE passwords;`;
    passwordEmitter.emit("reset");

    return true;
  }),
});
