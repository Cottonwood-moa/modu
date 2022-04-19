import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client;

export default client;

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
