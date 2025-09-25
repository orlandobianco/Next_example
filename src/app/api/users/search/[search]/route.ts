import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/users/pippo
export async function GET(
  req: Request,
  { params }: { params: { search: string } }
) {
  const term = params.search;

  if (!term || term.length < 2) {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: term } },
        { email: { contains: term } },
      ],
    },
    take: 10,
  });

  return NextResponse.json(users);
}