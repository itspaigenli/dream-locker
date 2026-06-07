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
describe("SignupPage", () => {
  it("sends the signup form", async () => {
    let signupOptions = {};

    global.fetch = async (url, options) => {
      signupOptions = options;

      return {
        ok: true,
        json: async () => ({
          message: "User registered successfully",
        }),
      };
    };

    render(
      <SignupPage API_URL="http://localhost:3000/api" setPage={() => {}} />,
    );

    await userEvent.type(screen.getByLabelText("Username"), "mara");
    await userEvent.type(screen.getByLabelText("Email"), "mara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "MaraPassword1!");
    await userEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(signupOptions.method).toBe("POST");
    expect(signupOptions.body).toContain("mara");
    expect(signupOptions.body).toContain("mara@example.com");
    expect(signupOptions.body).toContain("MaraPassword1!");
  });
});

// Test 3: Successful signup
describe("SignupPage", () => {
  it("shows a success message after signup works", async () => {
    const fakeSignupResponse = {
      message: "User registered successfully",
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => fakeSignupResponse,
    });

    render(
      <SignupPage API_URL="http://localhost:3000/api" setPage={() => {}} />,
    );

    await userEvent.type(screen.getByLabelText("Username"), "mara");
    await userEvent.type(screen.getByLabelText("Email"), "mara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "MaraPassword1!");
    await userEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(
      screen.getByText("User registered successfully"),
    ).toBeInTheDocument();
  });
});

// Test 4: Unsuccessful signup
describe("SignupPage", () => {
  it("shows an error message when signup fails", async () => {
    const fakeErrorResponse = {
      error: "Username already exists",
    };

    global.fetch = async () => ({
      ok: false,
      json: async () => fakeErrorResponse,
    });

    render(
      <SignupPage API_URL="http://localhost:3000/api" setPage={() => {}} />,
    );

    await userEvent.type(screen.getByLabelText("Username"), "mara");
    await userEvent.type(screen.getByLabelText("Email"), "mara@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "MaraPassword1!");
    await userEvent.click(
      screen.getByRole("button", { name: "Create Account" }),
    );

    expect(screen.getByText("Username already exists")).toBeInTheDocument();
  });
});
