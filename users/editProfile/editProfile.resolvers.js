import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, userName, email, password: newPassword },
      { loggedInUser }
    ) => {
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }

      const updatedUser = await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          firstName,
          lastName,
          userName,
          email,
          ...(uglyPassword && { password: uglyPassword }),
        },
      });
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update profile",
        };
      }
    },
  },
};
