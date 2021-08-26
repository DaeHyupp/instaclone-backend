import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    seeFeed: protectedResolver(async (_, { offset }, { loggedInUser }) => {
      const check = await client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              user: { id: loggedInUser.id },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: 2,
      });
      console.log(check);
      return check;
    }),
  },
};
