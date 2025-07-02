import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import {
  screen,
  render,
  queryByText,
  waitFor,
  cleanup,
  findByText,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { UserProfile } from "../src/UserProfile";
import { server } from "./mocks/node";
import { http, HttpResponse } from "msw";
import { User } from "../types/user";

describe("UserProfile", () => {
  beforeEach(() => {
    // server.resetHandlers();
  });

  afterEach(() => {
    cleanup();
  });

  test("initially renders a loading message", () => {
    render(<UserProfile id={1} />);
    expect(screen.findByText("Loading...")).not.toBeNull();
  });

  test("renders the passed in user", async () => {
    const expectedUser = {
      id: 1,
      firstName: "Jane",
      lastName: "Doe",
    };

    server.use(
      http.get<{ id: string }, never, User>("/users/1", async () => {
        return HttpResponse.json(expectedUser);
      })
    );

    render(<UserProfile id={1} />);
    await waitFor(() => {
      expect(screen.getByText("1")).not.toBeNull();
      expect(screen.getByText("Jane")).not.toBeNull();
      expect(screen.getByText("Doe")).not.toBeNull();
    });
  });

  test("renders the next user on clicking 'Next User'", async () => {
    render(<UserProfile id={1} />);
    userEvent.click(await screen.findByText("Next User"));
    await waitFor(() => {
      expect(screen.getByText("2")).not.toBeNull();
      expect(screen.getByText("Jack")).not.toBeNull();
      expect(screen.getByText("Chopper")).not.toBeNull();
    });
  });

  test("renders the previous user on clicking 'Previous User'", async () => {
    render(<UserProfile id={2} />);
    userEvent.click(await screen.findByText("Previous User"));
    await waitFor(() => {
      expect(screen.getByText("1")).not.toBeNull();
      expect(screen.getByText("John")).not.toBeNull();
      expect(screen.getByText("Maverick")).not.toBeNull();
    });
  });

  test("renders 2 times after switching users", async () => {
    const dispatchRequest = vi.fn();
    server.events.on("request:start", dispatchRequest);
    render(<UserProfile id={1} />);
    await waitFor(() => expect(dispatchRequest).toHaveBeenCalledTimes(1));
    userEvent.click(await screen.findByText("Next User"));
    await waitFor(() => expect(dispatchRequest).toHaveBeenCalledTimes(2));
  });
});
