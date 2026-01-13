import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";

describe("Login Component", () => {
  it("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(
      screen.getByPlaceholderText(/ingresa tu usuario/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/ingresa tu contraseña/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("updates input values", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText(
      /ingresa tu usuario/i
    ) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");
  });
});
