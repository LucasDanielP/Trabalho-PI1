# Testes Automatizados — Work & Rest

Este documento explica **como implementamos os testes** do projeto, com trechos de código que exemplificam cada abordagem e os comandos para executá-los.

---

## 1. Ferramentas escolhidas

Seguimos o que está previsto no README do projeto: **Vitest** para rodar os testes e **Testing Library** para simular o comportamento do usuário nos componentes React.

| Ferramenta | Função |
|------------|--------|
| **Vitest** | Executa os testes em TypeScript, com mocks (`vi.mock`) |
| **@testing-library/react** | Renderiza componentes e consulta a tela como o usuário vê |
| **@testing-library/user-event** | Simula digitação e cliques |
| **jsdom** | Simula o navegador sem abrir o Chrome |

A configuração fica em `vitest.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
});
```

O arquivo `tests/setup.ts` carrega matchers extras (`toBeInTheDocument`) e define variáveis de ambiente fictícias para que os testes não dependam do PostgreSQL rodando.

---

## 2. Estratégia: o que testamos e por quê

Organizamos os testes em **três camadas**, da mais simples à mais próxima da interface:

1. **Validação (Zod)** — entrada inválida é barrada antes de chegar ao banco
2. **Regras de negócio e API** — serviços, senha com hash, códigos HTTP corretos
3. **Componentes React** — formulário de login reage corretamente ao sucesso e ao erro

Nenhum teste precisa do Docker ou do Postgres: usamos **mocks** onde há dependência externa (Prisma, `fetch`, `useRouter`).

---

## 3. Testes de validação (Zod)

**Arquivo:** `lib/validations/usuario.test.ts`

Os schemas Zod (`createUsuarioSchema`, `loginUsuarioSchema`, etc.) são usados nas rotas da API. Testamos com `.safeParse()`, que retorna `success: true/false` sem lançar exceção — o mesmo padrão que a API usa antes de persistir dados.

Exemplo — aceitar dados válidos e normalizar o e-mail:

```typescript
it("aceita dados válidos e normaliza o e-mail", () => {
  const result = createUsuarioSchema.safeParse({
    nome: "  Lucas  ",
    email: "  Lucas@Email.COM ",
    senha: "senha123",
  });

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.nome).toBe("Lucas");
    expect(result.data.email).toBe("lucas@email.com");
  }
});
```

Exemplo — rejeitar senha curta e verificar a mensagem de erro:

```typescript
it("rejeita senha com menos de 6 caracteres", () => {
  const result = createUsuarioSchema.safeParse({
    nome: "Lucas",
    email: "teste@email.com",
    senha: "12345",
  });

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues[0]?.message).toContain("6 caracteres");
  }
});
```

**O que isso garante:** cadastros com e-mail malformado, nome vazio ou senha fraca nunca passam para o `usuario.service` nem para o PostgreSQL.

---

## 4. Testes de segurança (hash de senha)

**Arquivo:** `lib/auth/password.test.ts`

No cadastro, a senha passa por `hashSenha()` antes de ir ao banco. No login, `compararSenha()` verifica o texto digitado contra o hash salvo. Essas funções são puras em relação ao banco — testamos com bcrypt real.

```typescript
it("gera hash diferente da senha original", async () => {
  const senha = "minhaSenhaSegura";
  const hash = await hashSenha(senha);

  expect(hash).not.toBe(senha);
  expect(hash.startsWith("$2")).toBe(true);
});

it("valida senha correta", async () => {
  const senha = "senha123";
  const hash = await hashSenha(senha);

  expect(await compararSenha(senha, hash)).toBe(true);
});
```

**O que isso garante:** a senha nunca é armazenada em texto puro e a comparação no login funciona de forma confiável.

---

## 5. Testes da API (códigos HTTP)

**Arquivo:** `lib/api/errors.test.ts`

Todas as rotas (`/api/usuarios`, `/api/auth/login`, etc.) usam `handleRouteError()` para converter exceções em respostas JSON com o status HTTP adequado. Testamos esse mapeamento diretamente.

```typescript
it("retorna 401 para credenciais inválidas", async () => {
  const response = handleRouteError(
    new UsuarioServiceError("E-mail ou senha inválidos", "CREDENCIAIS_INVALIDAS"),
  );
  const body = await response.json();

  expect(response.status).toBe(401);
  expect(body.error).toBe("E-mail ou senha inválidos");
});
```

| Situação | Status HTTP |
|----------|-------------|
| Dados inválidos (Zod) | 400 |
| Login incorreto | 401 |
| Usuário não encontrado | 404 |
| E-mail já cadastrado | 409 |
| Erro inesperado | 500 |

**O que isso garante:** o front-end e integrações externas recebem respostas previsíveis e semânticas.

---

## 6. Testes de serviço (mock do Prisma)

**Arquivo:** `lib/services/usuario.service.test.ts`

O `usuario.service.ts` concentra a lógica de criar, autenticar e excluir usuários. Para não depender do PostgreSQL, substituímos o cliente Prisma por funções falsas com `vi.mock`:

```typescript
const prismaMock = vi.hoisted(() => ({
  usuario: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  prisma: prismaMock,
}));
```

Exemplo — criar usuário sem expor a senha na resposta:

```typescript
it("cria usuário e não expõe a senha na resposta", async () => {
  prismaMock.usuario.create.mockResolvedValue({
    id: "usr_1",
    nome: "Lucas",
    email: "lucas@email.com",
    senha: "$2a$12$hash",
    criadoEm: new Date("2026-01-01T10:00:00.000Z"),
  });

  const result = await createUsuario({
    nome: "Lucas",
    email: "lucas@email.com",
    senha: "senha123",
  });

  expect(result).not.toHaveProperty("senha");

  const createCall = prismaMock.usuario.create.mock.calls[0]?.[0];
  expect(createCall.data.senha).not.toBe("senha123");
  expect(createCall.data.senha).toMatch(/^\$2/);
});
```

Exemplo — autenticação com credenciais inválidas:

```typescript
it("lança CREDENCIAIS_INVALIDAS quando usuário não existe", async () => {
  prismaMock.usuario.findUnique.mockResolvedValue(null);

  await expect(
    autenticarUsuario({ email: "nao@existe.com", senha: "senha123" }),
  ).rejects.toMatchObject({
    code: "CREDENCIAIS_INVALIDAS",
  });
});
```

**O que isso garante:** regras de negócio (hash na criação, senha oculta na resposta, erros tipados) funcionam isoladas do banco.

---

## 7. Testes de componente (LoginForm)

**Arquivo:** `components/usuarios/login-form.test.tsx`

O `LoginForm` chama `fetch("/api/auth/login")` e redireciona com `useRouter` do Next.js. Nos testes, mockamos essas dependências e simulamos o usuário preenchendo o formulário.

Mocks do Next.js e do `fetch`:

```typescript
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
}));

beforeEach(() => {
  global.fetch = vi.fn();
});
```

Exemplo — fluxo de login com sucesso:

```typescript
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
  });
});
```

Exemplo — exibir erro na tela:

```typescript
it("exibe mensagem de erro quando credenciais são inválidas", async () => {
  vi.mocked(global.fetch).mockResolvedValue({
    ok: false,
    json: async () => ({ error: "E-mail ou senha inválidos" }),
  } as Response);

  // ... preenche formulário e clica ENTRAR

  expect(
    await screen.findByText("E-mail ou senha inválidos"),
  ).toBeInTheDocument();
  expect(pushMock).not.toHaveBeenCalled();
});
```

**O que isso garante:** a interface reage corretamente sem precisar subir o servidor Next.js nem o banco.

---

## 8. Resumo dos arquivos de teste

| Arquivo | Testes | Camada |
|---------|--------|--------|
| `lib/validations/usuario.test.ts` | 8 | Validação Zod |
| `lib/auth/password.test.ts` | 3 | Hash bcrypt |
| `lib/api/errors.test.ts` | 5 | Respostas HTTP |
| `lib/services/usuario.service.test.ts` | 6 | Serviço + mock Prisma |
| `components/usuarios/login-form.test.tsx` | 3 | Componente React |
| **Total** | **25** | |

---

## 9. Como executar os testes

### Rodar todos os testes (uma vez)

```bash
pnpm test
```

### Modo watch (re-executa ao salvar arquivos)

```bash
pnpm test:watch
```

### Com relatório de cobertura

```bash
pnpm test:coverage
```

### Saída esperada

```
 Test Files  5 passed (5)
      Tests  25 passed (25)
```

Os testes **não exigem** `pnpm db:up` nem `pnpm dev` — rodam de forma independente da aplicação.

---

## 10. Próximos passos (opcional)

- Testes para `UsuarioForm` (cadastro)
- Pipeline no GitHub Actions executando `pnpm test` antes do merge
- Testes E2E com Playwright (fluxo completo no navegador)
