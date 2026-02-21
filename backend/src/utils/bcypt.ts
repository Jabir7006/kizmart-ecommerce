import bcrypt from "bcryptjs";

export const hashPassword = async (password: string, saltRound: number = 10) => {
    return await bcrypt.hash(password, saltRound);
}

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}
