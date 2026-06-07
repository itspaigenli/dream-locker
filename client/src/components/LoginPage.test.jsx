import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "./LoginPage.jsx";

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

// Test 3: Form Submission works

// Test 4: Successful Login

// Test 5: Unsuccessful Login
