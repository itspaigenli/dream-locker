import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SignupPage from "./SignupPage.jsx";

/* describe("SignupPage", () => {
  it("shows the signup form", () => {
    render(<SignupPage API_URL="http://localhost:3000/api" setPage={() => {}} />);

    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
  });
}); */

// Test 1: Render the form
describe("SignupPage", () => {
  it("shows the signup form", () => {
    render(
      <SignupPage API_URL="http://localhost:3000/api" setPage={() => {}} />,
    );

    expect(
      screen.getByRole("heading", { name: "Sign Up" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
  });
});

// Test 2: Form sends signup request

// Test 3: Successful signup

// Test 4: Unsuccessful signup
