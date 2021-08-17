import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
        where: { photoId: id },
        //need to do pagination
        orderBy: { createdAt: "asc" },
      }),
  },
};
