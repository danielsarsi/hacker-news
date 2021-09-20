import type { Middleware } from "swr";

export const loadingStateMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    if (fetcher === null) {
      return useSWRNext(key, fetcher, config);
    }

    const fetcherWihLoadingState = async (...args: unknown[]) => {
      document.dispatchEvent(new CustomEvent("loading", { detail: true }));
      try {
        const req = await fetcher(...args);
        document.dispatchEvent(new CustomEvent("loading", { detail: false }));
        return req;
      } catch (err) {
        document.dispatchEvent(new CustomEvent("loading", { detail: false }));
        throw err;
      }
    };

    return useSWRNext(key, fetcherWihLoadingState, config);
  };
};
