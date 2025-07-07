import { describe, expect, Mock, test, vi } from "vitest";
import {
  useUserGalleryData,
  UserGalleryDataProvider,
} from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserAvatarScale } from "../types/user";

const printNumberOfCalls = (func: Mock) => {
  console.log(func.mock.calls.length);
};

const MockContextConsumer = vi.fn(() => {
  const { userAvatarScales } = useUserGalleryData();

  return <UserGallery />;
});

const delay = async (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("UserGalleryContext", () => {
  test("renders user gallery with default fetched value", async () => {
    const scales = (await (
      await fetch("/users/avatars")
    ).json()) as UserAvatarScale[];

    render(
      <UserGalleryDataProvider>
        <MockContextConsumer />
      </UserGalleryDataProvider>
    );

    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalled();
    });

    const actual = Array.from(document.querySelectorAll("li")).map(
      (m) => m.textContent
    );

    expect(scales.map((s) => s.toString())).toEqual(actual);

    screen.debug();
  });

  // test("re-renders all consumers when it re-renders", async () => {
  //   render(
  //     <UserGalleryDataProvider>
  //       <MockContextConsumer />
  //     </UserGalleryDataProvider>
  //   );
  //   await waitFor(() => {
  //     expect(MockContextConsumer).toHaveBeenCalledTimes(2);
  //   });
  //   userEvent.click(await screen.getByText("New Users"));
  //   await waitFor(() => {
  //     expect(MockContextConsumer).toHaveBeenCalledTimes(3);
  //   });

  //   userEvent.click(await screen.getByText("New Users"));
  //   await waitFor(() => {
  //     expect(MockContextConsumer).toHaveBeenCalledTimes(4);
  //   });
  //   userEvent.click(await screen.getByText("New Users"));
  //   await waitFor(() => {
  //     expect(MockContextConsumer).toHaveBeenCalledTimes(5);
  //   });
  //   userEvent.click(await screen.findByText("New Users"));
  //   await waitFor(() => {
  //     expect(MockContextConsumer).toHaveBeenCalledTimes(6);
  //   });
  // });
});
