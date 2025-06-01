import { prismaClient } from "@/shared/lib/prisma-client";
import { Work } from "@prisma/client";


interface GetWorksResult {
    works: Work[];
    error: string | null;
}

export async function geWorks(email: string): Promise<GetWorksResult> {
    try {
        const works = await prismaClient.work.findMany({
            where: { User: { email } }
        });

        if (!works || works.length === 0) {
            return {
                works: [],
                error: null,
            };
        }

        return {
            works,
            error: null,
        };
    } catch (err) {
        if (err instanceof Error) {
            return {
                works: [],
                error: JSON.stringify(err),
            };
        }
        return {
            works: [],
            error: "Unknown error",
        };
    }
}
