import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { UserGalleryProvider } from "../src/UserGalleryContext";
import { UserGallery } from "../src/UserGallery";
import { UserAvatar } from "../src/UserAvatar";

vi.mock("../src/UserAvatar", () => ({
  UserAvatar: vi.fn(() => <div id="UserAvatar"></div>),
}));

describe("UserGallery", () => {
  test("renders all fetched UserAvatars", async () => {
    render(
      <UserGalleryProvider>
        <UserGallery />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(UserAvatar).toHaveBeenCalled();
    });

    // waitFor(() => {
    //   expect(screen.findAllByText("0.1")).not.toBeNull();
    // });
    expect(UserAvatar).toHaveBeenCalledTimes(4);
    // expect(UserAvatar).toHaveBeenCalledTimes(3);
  });
});
