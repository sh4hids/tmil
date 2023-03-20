import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { noteSchema } from '~/types/validation';

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const notes = await ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    console.log('Notes from db:', notes);

    return [
      {
        id: 'ab-cd-ed',
        title: 'Test note 1',
        body: 'Hello world!',
      },
      {
        id: 'da-fd-ed',
        title: 'Test note 2',
        body: 'Hello from another world!',
      },
    ];
  }),
  create: protectedProcedure
    .input(noteSchema)
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.create({
        data: {
          title: input.title,
          body: input.body,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return note;
    }),
  update: protectedProcedure
    .input(noteSchema)
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          body: input.body,
        },
      });

      return note;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      return ctx.prisma.note.delete({
        where: {
          id,
        },
      });
    }),
});
