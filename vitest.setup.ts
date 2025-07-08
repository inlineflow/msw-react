import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./test/mocks/node";
import { cleanup } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close);
