import { z } from "zod";
import { clearAccessToken, clearRefreshToken, getAccessToken, refreshAccessTokenSilently, setAccessToken, setRefreshToken } from "./tokenStorage";

const LoginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string().optional(),
	user: z
		.object({
			id: z.union([z.string(), z.number()]).transform(String),
			email: z.string().email().optional(),
			name: z.string().optional(),
			// extend as needed
		})
		.optional(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
	// 1. Simulate 1-second network delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// 2. Commented out the actual fetch to the API endpoint since the backend is not deployed
	/*
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
	const res = await fetch(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
		credentials: "include",
	});
	if (!res.ok) {
		const message = await safeErrorMessage(res);
		throw new Error(message);
	}
	const data = await res.json();
	const parsed = LoginResponseSchema.parse(data);
	setAccessToken(parsed.accessToken);
	if (parsed.refreshToken) setRefreshToken(parsed.refreshToken);
	return parsed;
	*/

	// 3. Return a mock login response to bypass real authentication checks
	const mockAccessToken = "mock_access_token_" + Math.random().toString(36).substring(2);
	const mockRefreshToken = "mock_refresh_token_" + Math.random().toString(36).substring(2);
	
	const mockUser = {
		id: "mock-user-123",
		email: email || "employee@example.com",
		name: email ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1) : "Mock User",
	};

	setAccessToken(mockAccessToken);
	setRefreshToken(mockRefreshToken);

	return {
		accessToken: mockAccessToken,
		refreshToken: mockRefreshToken,
		user: mockUser,
	};
}

export async function logout() {
	clearAccessToken();
	clearRefreshToken();
}

export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit, retryOn401 = true) {
	const withAuth = async (): Promise<Response> => {
		const token = getAccessToken();
		const headers = new Headers(init?.headers || {});
		if (token) headers.set("Authorization", `Bearer ${token}`);
		return fetch(input, { ...init, headers, credentials: "include" });
	};
	let res = await withAuth();
	if (res.status === 401 && retryOn401) {
		const token = await refreshAccessTokenSilently();
		if (token) {
			res = await withAuth();
		}
	}
	return res;
}

async function safeErrorMessage(res: Response): Promise<string> {
	try {
		const data = (await res.json());
		return data?.message || `Request failed with status ${res.status}`;
	} catch {
		return `Request failed with status ${res.status}`;
	}
}


