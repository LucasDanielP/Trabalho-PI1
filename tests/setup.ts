import "@testing-library/jest-dom/vitest";

process.env.DATABASE_URL ??=
  "postgresql://workandrest:workandrest@localhost:5433/workandrest";
process.env.AUTH_SECRET ??= "test-secret-para-ambiente-de-testes";
