import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { userName, page }) => {
      const ok = await client.user.findUnique({
        where: { userName },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const aFollowers = await client.user
        .findUnique({ where: { userName } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFolloweres = await client.user.count({
        where: { following: { some: { userName } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFolloweres / 5),
      };
    },
  },
};
