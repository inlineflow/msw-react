import { describe, expect, Mock, test, vi } from "vitest";
import {
  useUserGalleryData,
  UserGalleryDataProvider,
} from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  test("re-renders all consumers when it re-renders", async () => {
    render(
      <UserGalleryDataProvider>
        <MockContextConsumer />
      </UserGalleryDataProvider>
    );
    printNumberOfCalls(MockContextConsumer);
    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalledTimes(2);
    });
    printNumberOfCalls(MockContextConsumer);
    userEvent.click(await screen.getByText("New Users"));
    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalledTimes(3);
    });

    userEvent.click(await screen.getByText("New Users"));
    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalledTimes(4);
    });
    userEvent.click(await screen.getByText("New Users"));
    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalledTimes(5);
    });
    userEvent.click(await screen.findByText("New Users"));
    await waitFor(() => {
      expect(MockContextConsumer).toHaveBeenCalledTimes(6);
    });
  });
});
