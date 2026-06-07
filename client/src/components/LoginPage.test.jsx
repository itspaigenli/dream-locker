import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "./LoginPage.jsx";
import userEvent from "@testing-library/user-event";

/* describe("ComponentName", () => {
  it("what the test checks", () => {
    render(component)

    expect(thing on page).toBeInTheDocument()
  });
}); */

// Test 1: Render the form
describe("LoginPage", () => {
  it("shows the login form", () => {
    render(
      <LoginPage
        API_URL="http://localhost:3000/api"
        onLoginSuccess={() => {}}
      />,
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username or Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
});

// Test 2: Input boxes accept text
describe("LoginPage", () => {
  it("lets the user type into the login form", async () => {
    render(
      <LoginPage
        API_URL="http://localhost:3000/api"
        onLoginSuccess={() => {}}
      />,
    );

    const userInput = screen.getByLabelText("Username or Email");
    const passwordInput = screen.getByLabelText("Password");

    await userEvent.type(userInput, "admin@example.com");
    await userEvent.type(passwordInput, "AdminPassword1!");

    expect(userInput).toHaveValue("admin@example.com");
    expect(passwordInput).toHaveValue("AdminPassword1!");
  });
});

// Test 3: Form Submission works
describe("LoginPage", () => {
  it("lets the user click the login button", async () => {
    render(
      <LoginPage
        API_URL="http://localhost:3000/api"
        onLoginSuccess={() => {}}
      />,
    );

    const loginButton = screen.getByRole("button", { name: "Login" });

    await userEvent.click(loginButton);

    expect(loginButton).toBeInTheDocument();
  });
});

// Test 4: Successful Login
describe("LoginPage", () => {
  it("shows a success message after login works", async () => {
    const fakeLoginResponse = {
      token: "fake-token",
      user: { id: 1, username: "admin", role: "admin" },
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => fakeLoginResponse,
    });

    render(
      <LoginPage
        API_URL="http://localhost:3000/api"
        onLoginSuccess={() => {}}
      />,
    );

    await userEvent.type(
      screen.getByLabelText("Username or Email"),
      "admin@example.com",
    );
    await userEvent.type(screen.getByLabelText("Password"), "AdminPassword1!");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Login successful")).toBeInTheDocument();
  });
});

// Test 5: Unsuccessful Login
describe("LoginPage", () => {
  it("shows an error message when login fails", async () => {
    const fakeErrorResponse = {
      error: "Invalid credentials",
    };

    global.fetch = async () => ({
      ok: false,
      json: async () => fakeErrorResponse,
    });

    render(
      <LoginPage
        API_URL="http://localhost:3000/api"
        onLoginSuccess={() => {}}
      />,
    );

    await userEvent.type(
      screen.getByLabelText("Username or Email"),
      "admin@example.com",
    );
    await userEvent.type(screen.getByLabelText("Password"), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
