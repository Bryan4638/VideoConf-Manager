import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "../../stores/authStore";
import api from "../../lib/api";

// Mock the API module
vi.mock("../../lib/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock localStorage if not already done in setupTests
// Since setupTests handles global localStorage mock, we can just spy on it here to assert calls
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("AuthStore Unit Tests", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    vi.clearAllMocks();
  });

  it("should initialize with no user", () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it("login should update state and localStorage on success", async () => {
    const mockUser = { id: "1", username: "test" }; // Match User interface (id is string)
    const mockToken = "abc-123";

    // Mock successful API response
    (api.post as any).mockResolvedValue({
      data: { user: mockUser, token: mockToken },
    });

    const result = await useAuthStore.getState().login("test", "password");

    expect(result).toBe(true);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);

    expect(localStorageMock.setItem).toHaveBeenCalledWith("token", mockToken);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser)
    );
  });

  it("logout should clear state and localStorage", () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: 1, username: "test" } as any,
      token: "token",
      isAuthenticated: true,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
  });
});
