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
  UserGalleryProvider,
  useUserGalleryAchievements,
  useUserGalleryAPI,
  useUserGalleryAvatars,
} from "../src/UserGalleryContext";
import * as UserFetcherModule from "../src/UserFetcher";
// import * as UserAchievementsModule from "../src/achievements/UserAchievements";
import { UserAchievements } from "../src/achievements/UserAchievements";
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
import { useCallback, useEffect } from "react";

const printNumberOfCalls = (func: Mock) => {
  console.log(func.mock.calls.length);
};

const MockAchievementsConsumer = vi.fn(() => {
  const userAchievements = useUserGalleryAchievements();

  console.log(userAchievements);

  return (
    <div data-testid="MockAchievementsConsumer">
      <ul>
        {userAchievements.map((a) => (
          <li>{a}</li>
        ))}
      </ul>
    </div>
  );
});

const MockAchievementsUpdater = vi.fn(() => {
  const { onUpdateUserAchievements } = useUserGalleryAPI();

  const fetchAchievements = useCallback(async (id: number = 1) => {
    const resp = await fetch(`/users/achievements/${id}`);
    const result = (await resp.json()) as string[];

    console.log("Achievements in fetch: ", result);

    onUpdateUserAchievements(result);
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <div data-testid="MockAchievementsUpdater">
      <button onClick={() => fetchAchievements(2)}>Refresh Achievements</button>
    </div>
  );
});

const MockAchievements = vi.fn(() => (
  <div>
    <MockAchievementsConsumer />
    <MockAchievementsUpdater />
  </div>
));

const MockUserGallery = vi.fn(() => {
  const userAvatarScales = useUserGalleryAvatars();

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
        <MockUserGallery />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(MockUserGallery).toHaveBeenCalled();
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
        <MockUserGallery />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(MockUserGallery).toHaveBeenCalled();
    });

    expect(MockUserGallery).toHaveBeenCalledTimes(2);
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
    render(
      <UserGalleryProvider>
        <MockAchievements />
        <MockUserGallery />
        <UserFetcherModule.UserFetcher />
      </UserGalleryProvider>
    );

    await waitFor(() => {
      expect(screen.findByText("Collected 111 trophies")).not.toBeNull();
    });
    // screen.debug();
    await userEvent.click(screen.getByText("Refresh Achievements"));
    await waitFor(() => {
      screen.findByText("Caught a pokemon");
    });
    expect(MockAchievementsConsumer.mock.calls.length).toBeGreaterThan(
      MockUserGallery.mock.calls.length
    );
    await userEvent.click(screen.getByText("New Users"));
    await waitFor(() => {
      screen.findByText("Caught a pokemon");
    });
    expect(MockAchievementsConsumer.mock.calls.length).toBe(
      MockUserGallery.mock.calls.length
    );
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
