import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    //verified token is an object like {id:##, iat:####} we just need id, so...
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
