type HttpInit = Omit<RequestInit, "body"> & { body?: unknown };

export const httpClient = {
  get: async (url: string, init: HttpInit) => request(url, { ...init, method: "GET" }),
  post: async (url: string, init: HttpInit) => request(url, { ...init, method: "POST" }),
  patch: async (url: string, init: HttpInit) => request(url, { ...init, method: "PATCH" }),
  put: async (url: string, init: HttpInit) => request(url, { ...init, method: "PUT" }),
  delete: async (url: string, init: HttpInit) => request(url, { ...init, method: "DELETE" }),
};

const request = async (
  url: string,
  { headers, body, ...init }: Omit<RequestInit, "body"> & { body?: unknown },
) => {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
};
