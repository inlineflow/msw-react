import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from "vitest";
import {
  useUserGalleryData,
  UserGalleryProvider,
} from "../src/UserGalleryContext";
import * as UserFetcherModule from "../src/UserFetcher";
import * as UserAchievementsModule from "../src/achievements/UserAchievements";
import { UserGallery } from "../src/UserGallery";
import * as UserGalleryModule from "../src/UserGallery";
import {
  cleanup,
  findByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserAvatarScale } from "../types/user";

vi.mock("../src/UserAchievements", async (importOriginal) => {
  const x = await importOriginal();
  return {
    ...x,
    UserAchievements: 1,
    UserAchievementsDisplay: vi.fn(() => (
      <div data-testid="UserAchievementsDisplay"></div>
    )),
  };
});

const printNumberOfCalls = (func: Mock) => {
  console.log(func.mock.calls.length);
};

const MockDataContextConsumer = vi.fn(() => {
  const { userAvatarScales } = useUserGalleryData();

  return <UserGallery />;
});

const MockComponent = vi.fn(() => <UserGallery />);

const delay = async (ms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("UserGalleryContext", () => {
  // afterEach(() => {
  //   cleanup();
  // });

  test("renders user gallery with default fetched value", async () => {
    const scales = (await (
      await fetch("/users/avatars")
    ).json()) as UserAvatarScale[];

    render(
      <UserGalleryProvider>
        <MockDataContextConsumer />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(MockDataContextConsumer).toHaveBeenCalled();
    });

    const actual = Array.from(document.querySelectorAll("li")).map(
      (m) => m.textContent
    );

    expect(scales.map((s) => s.toString())).toEqual(actual);

    // screen.debug();
  });

  test("Component doesn't re-render if it's not a context consumer", async () => {
    render(
      <UserGalleryProvider>
        <MockComponent />
        <UserFetcherModule.UserFetcher />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(MockComponent).toHaveBeenCalled();
    });

    userEvent.click(await screen.findByText("New Users"));
    await waitFor(() => {
      expect(MockComponent).toHaveBeenCalledTimes(1);
    });

    userEvent.click(await screen.findByText("New Users"));
    await waitFor(() => {
      expect(MockComponent).toHaveBeenCalledTimes(1);
    });

    expect(MockComponent.mock.calls.length).toBe(1);
  });

  test("Component does re-render if it's a context consumer", async () => {
    render(
      <UserGalleryProvider>
        <MockDataContextConsumer />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(MockDataContextConsumer).toHaveBeenCalled();
    });

    expect(MockDataContextConsumer).toHaveBeenCalledTimes(2);
  });

  test("Components using the API Provider don't re-render on Data Provider changes", async () => {
    const userFetcherSpy = vi.spyOn(UserFetcherModule, "UserFetcher");
    render(
      <UserGalleryProvider>
        <UserGallery />
        <UserFetcherModule.UserFetcher />
      </UserGalleryProvider>
    );

    expect(userFetcherSpy.mock.calls.length).toBe(1);
    userEvent.click(await screen.getByText("New Users"));
    await waitFor(() => {
      expect(userFetcherSpy).toBeCalled();
      expect(userFetcherSpy.mock.calls.length).toBe(1);
    });

    userEvent.click(await screen.getByText("New Users"));
    await waitFor(() => {
      expect(userFetcherSpy).toBeCalled();
      expect(userFetcherSpy.mock.calls.length).toBe(1);
    });

    // userEvent.click(await screen.getByText("New Users"));
    // await waitFor(() => {
    //   expect(userFetcherSpy.mock.calls.length).toBe(1);
    // });
  });

  test("If 2 consumers share the state, both of them re-render on change", async () => {
    const displayMock = vi.fn();
    const userAchievementsDisplaySpy = vi
      .spyOn(UserAchievementsModule, "UserAchievementsDisplay")
      .mockImplementation(() => {
        displayMock();
        return (
          <div data-testid="UserAchievementsDisplay">
            Collected 111 trophies
          </div>
        );
      });
    // const userAchievementsFetcherSpy = vi.spyOn(
    //   UserAchievementsModule,
    //   "UserAchievementsFetcher"
    // );
    const userGallerySpy = vi.spyOn(UserGalleryModule, "UserGallery");
    // const userAchievementsSpy = vi.spyOn(
    //   UserAchievementsModule,
    //   "UserAchievements"
    // );

    render(
      <UserGalleryProvider>
        <UserGallery />
        <UserFetcherModule.UserFetcher />
        <UserAchievementsModule.UserAchievements />
      </UserGalleryProvider>
    );

    // await waitFor(() => {
    //   screen.getByText("Collected 111 trophies");
    // });
    // userEvent.click(await screen.findByText("Refresh Achievements"));
    // await waitFor(() => {
    //   expect(userAchievementsDisplaySpy).toHaveBeenCalled();
    // });
    await waitFor(() => {
      screen.getByTestId("UserAchievementsDisplay");
    });
    console.log(userAchievementsDisplaySpy.mock.calls);
    console.log(userGallerySpy.mock.calls);
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
