import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { UserGalleryProvider } from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";
import { UserAvatar } from "../src/UserAvatar";
import { server } from "./mocks/node";
import { UserAvatarScale } from "../types/user";

vi.mock("../src/UserAvatar", () => ({
  UserAvatar: vi.fn(() => <div id="UserAvatar"></div>),
}));

describe("UserGallery", () => {
  test("renders all fetched UserAvatars", async () => {
    const scales = (await (
      await fetch("/users/avatars")
    ).json()) as UserAvatarScale[];
    render(
      <UserGalleryProvider>
        <UserGallery />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(UserAvatar).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(UserAvatar).toHaveBeenCalledTimes(scales.length);
    });
    // screen.debug();
  });

  test("");
});
