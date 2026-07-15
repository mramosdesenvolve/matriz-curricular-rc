import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    perfil: string; // "admin" | "orientador" | "professor"
    unidade: string | null;
    componentes: string; // JSON string[] — só relevante quando perfil = "professor"
  }

  interface Session {
    user: {
      id: string;
      perfil: string;
      unidade: string | null;
      componentes: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    perfil: string;
    unidade: string | null;
    componentes: string;
  }
}
