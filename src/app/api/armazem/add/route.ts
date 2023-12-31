import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { findUserByEmail } from "@/app/models/User";

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    const requestBody = await request.json()

    const email = requestBody.sessionEmail
    const ingredientId = requestBody.ingredientsId

    const user = await findUserByEmail(email);

    const exist = await prisma.user_ingredient_storage.findFirst({
        where: {
            user_id: user,
            ingredient_id: ingredientId
        }
    })

    if (user && !exist) {
        const armazem = await prisma.user_ingredient_storage.create({
            data: {
                user_id: user,
                ingredient_id: ingredientId,
                quantity: 0
            }
        })
        return NextResponse.json(armazem);
    }
    return NextResponse.json("O ingrediente já existe");
}
