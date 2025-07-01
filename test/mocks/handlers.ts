import { http, HttpResponse } from "msw";
import { User } from "../../types/user";

export const handlers = [
  http.get<never, never, User>("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: 123,
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
