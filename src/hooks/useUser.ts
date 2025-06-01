import { prismaClient } from "@/shared/lib/prisma-client";
import { IUserData } from "@/types/types"

export async function getUser(email: string) {
    try {

        const user = await prismaClient.user.findUnique({
            where: { email }
        })

        if (!user) {
            return {
                error: "User not found",
                email: null
            }
        }

        return { email: user.email, error: null } as IUserData

    } catch (err) {
        if (err instanceof Error) {
            return {
                error: JSON.stringify(err),
                email: null
            }

        }

    }

}