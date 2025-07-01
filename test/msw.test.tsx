import { describe, expect, it, test } from "vitest";
import { User } from "../types/user";

describe("MSW", () => {
  test("calling fetch returns expected object", async () => {
    const expected: User = {
      id: 123,
      firstName: "John",
      lastName: "Maverick",
    };

    const resp = await fetch("https://api.example.com/user");
    const actual = (await resp.json()) as User;

    expect(expected).toEqual(actual);
  });
});
