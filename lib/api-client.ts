import { auth } from "@/app/api/auth/[...nextauth]/auth";

type FetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  tags?: string[];
  cache?: RequestCache;
  isFormData?: boolean;
  revalidate?: number | false;
  credentials?: RequestCredentials;
};

type ApiResponse<TData> = { data: TData; error: null; statusCode: number } | { data: null; error: string; statusCode: number };

async function apiClient<TResponse = any, TBody = undefined>(
  url: string,
  options: FetchOptions<TBody> = {}
): Promise<ApiResponse<TResponse>> {
  const { method = "GET", body, tags, cache, isFormData = false, revalidate, credentials } = options;

  try {
    const session = await auth();
    const token = session?.user?.token;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;

    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData && body) {
      headers["Content-Type"] = "application/json";
    }

    const isMutation = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";

    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
      body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
      credentials: "include",
    };

    if (isMutation) {
      fetchOptions.cache = "no-store";
    } else {
      if (cache) fetchOptions.cache = cache;

      if (tags || revalidate !== undefined) {
        fetchOptions.next = {
          ...(tags && { tags }),
          ...(revalidate !== undefined && { revalidate }),
        };
      }
    }

    const res = await fetch(`${baseURL}${url}`, fetchOptions);
    if (!res.ok) {
      let errorMessage = `HTTP error! status: ${res.status}!`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        const errorText = await res.text();
        errorMessage = errorText || errorMessage;
      }

      return { data: null, error: errorMessage, statusCode: res.status };
    }

    const data = await res.json();
    return { data, error: null, statusCode: res.status };
  } catch (error) {
    if ((error as any)?.cause?.code === "ENOTFOUND") {
      return {
        data: null,
        error: "Unable to connect. Please check your internet connection.",
        statusCode: 503,
      };
    }
    console.log(error);
    return {
      data: null,
      error: "Something went wrong. Please try again later.",
      statusCode: 500,
    };
  }
}

export default apiClient;
