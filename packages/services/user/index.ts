import { randomBytes, createHmac } from "node:crypto";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
} from "./model";

class UserService {
  private async getUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result;
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordInputType,
  ) {
    const { email, fullName, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);
    // check user already existing
    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail)
      throw new Error(`user with email ${email} already exists`);
    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

    const userInserResult = await db
      .insert(usersTable)
      .values({ fullName, email, password: hash, salt })
      .returning({
        id: usersTable.id,
      });

    if (
      !userInserResult ||
      userInserResult.length === 0 ||
      !userInserResult[0]?.id
    )
      throw new Error("something went wrong while creating user");

    return { id: userInserResult[0].id };
  }
}

export default UserService;
