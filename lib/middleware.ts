import { Middleware } from "swr";

export const loadingStateMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    if (fetcher === null) {
      return useSWRNext(key, fetcher, config);
    }

    const fetcherWihLoadingState = async (...args: unknown[]) => {
      document.dispatchEvent(new CustomEvent("loading", { detail: true }));
      const req = await fetcher(...args);
      document.dispatchEvent(new CustomEvent("loading", { detail: false }));
      return req;
    };

    return useSWRNext(key, fetcherWihLoadingState, config);
  };
};
