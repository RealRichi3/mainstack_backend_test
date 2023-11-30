import { IPasswordDoc } from "../../interfaces/database-models/password";
import bcrypt from "bcrypt";

export async function updatePassword(this: IPasswordDoc, password: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    this.password = hash;
    await this.save();
}

export async function comparePassword(this: IPasswordDoc, password: string) {
    return bcrypt.compareSync(password, this.password);
}
