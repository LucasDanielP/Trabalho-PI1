import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "./login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renderiza campos de e-mail, senha e botão ENTRAR", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ENTRAR" })).toBeInTheDocument();
  });

  it("redireciona para /timer após login bem-sucedido", async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "1", nome: "Lucas", email: "lucas@email.com" }),
    } as Response);

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("E-mail"), "lucas@email.com");
    await user.type(screen.getByPlaceholderText("Senha"), "senha123");
    await user.click(screen.getByRole("button", { name: "ENTRAR" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/timer");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("exibe mensagem de erro quando credenciais são inválidas", async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "E-mail ou senha inválidos" }),
    } as Response);

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("E-mail"), "errado@email.com");
    await user.type(screen.getByPlaceholderText("Senha"), "senhaErrada");
    await user.click(screen.getByRole("button", { name: "ENTRAR" }));

    expect(
      await screen.findByText("E-mail ou senha inválidos"),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
