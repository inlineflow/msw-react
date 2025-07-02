import { describe, expect, it, test, vi } from "vitest";
import { User } from "../types/user";
import { server } from "./mocks/node";

describe("MSW", () => {
  test("calling fetch returns expected object", async () => {
    const expected: User = {
      id: 1,
      firstName: "John",
      lastName: "Maverick",
    };

    const resp = await fetch("/users/1");
    const actual = (await resp.json()) as User;

    expect(expected).toEqual(actual);
  });

  test("matches call count when called once", async () => {
    const dispatchRequest = vi.fn();
    server.events.on("request:start", dispatchRequest);

    const resp = await fetch("/users/1");

    expect(dispatchRequest).toHaveBeenCalledTimes(1);
  });

  test("matches call count when called multiple times", async () => {
    const dispatchRequest = vi.fn();
    server.events.on("request:start", dispatchRequest);

    const resp1 = await fetch("/users/1");
    const resp2 = await fetch("/users/1");
    const resp3 = await fetch("/users/1");

    expect(dispatchRequest).toHaveBeenCalledTimes(3);
  });
});
