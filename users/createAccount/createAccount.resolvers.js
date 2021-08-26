import bycrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      //check if userName or email are already on DB
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ userName }, { email }],
          },
        });
        if (existingUser) {
          throw new Error("This username/email is already taken.");
        }
        // hash password
        const uglyPassword = await bycrypt.hash(password, 10);
        // save and return the user
        const created = await client.user.create({
          data: {
            userName,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return { ok: true };
      } catch (e) {
        return e;
      }
    },
  },
};
