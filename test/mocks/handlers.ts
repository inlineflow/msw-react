import { http, HttpResponse } from "msw";
import { User, UserAvatarScale } from "../../types/user";

const users = [
  {
    id: 1,
    firstName: "John",
    lastName: "Maverick",
  },

  {
    id: 2,
    firstName: "Jack",
    lastName: "Chopper",
  },
  {
    id: 3,
    firstName: "Mary",
    lastName: " Sue",
  },
];

export const handlers = [
  http.get("/users/avatars", () => {
    const resp = HttpResponse.json<UserAvatarScale[]>([0.1, 0.2, 0.1, 0.3]);
    return resp;
  }),
  http.get("/users/achievements/2", () => {
    const resp = HttpResponse.json(["Caught a pokemon", "Made a playthrough"]);
    return resp;
  }),
  http.get("/users/achievements/1", () => {
    const resp = HttpResponse.json([
      "Finished course X",
      "Logged in for 300 days",
      "Collected 111 trophies",
    ]);

    return resp;
  }),
  http.get<{ id: string }, never, User>("/users/:id", ({ params }) => {
    const { id } = params;
    const userId = parseInt(id);
    const index = userId - 1;
    if (index < 0) {
      throw new Error("Non existing user, index < 0");
    }
    return HttpResponse.json(users[index]);
  }),
];
