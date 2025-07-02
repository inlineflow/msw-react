import { http, HttpResponse } from "msw";
import { User } from "../../types/user";

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
