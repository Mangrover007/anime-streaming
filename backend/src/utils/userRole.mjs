import { prisma } from "../index.mjs";

/**
 * throws error if user not found
 * @param username - accepts username or email both
 * @returns enum string "USER" or "ADMIN"
 */
export async function userRole(username) {
    const findUser = await prisma.user.findUnique({
        where: {
            username: username
        },
        include: {
            role: true
        }
    });

    if (!findUser) {
        throw new Error("User not found");
    }

    return findUser.role.name;
}
