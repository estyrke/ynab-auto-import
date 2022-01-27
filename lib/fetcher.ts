
export class FetchError extends Error {
  info: any;
  status?: number;
}

export const fetcher = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, init);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}