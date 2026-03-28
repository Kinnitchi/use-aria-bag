"use server";

import { desc } from "drizzle-orm";
import { adminActionClient } from "@/src/lib/safe-action";
import { db } from "@/src/db";
import { authUserTable, ordersTable } from "@/src/db/schema";
import { z } from "zod";

export const getAdminOrdersAction = adminActionClient.schema(z.object({})).action(async () => {
  const orders = await db.query.ordersTable.findMany({
    with: {
      items: {
        with: {
          product: {
            with: { model: true, color: true },
          },
        },
      },
    },
    orderBy: [desc(ordersTable.createdAt)],
  });
  return { orders };
});

export const getAdminCustomersAction = adminActionClient.schema(z.object({})).action(async () => {
  const customers = await db.query.authUserTable.findMany({
    orderBy: [desc(authUserTable.createdAt)],
  });
  return { customers };
});
