import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registrarAcao } from "@/lib/auditoria";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        nome: { label: "Nome", type: "text" },
        codigo: { label: "Código de acesso", type: "password" },
      },
      async authorize(credentials) {
        const nome = credentials?.nome;
        const codigo = credentials?.codigo;
        if (typeof nome !== "string" || typeof codigo !== "string" || !nome || !codigo) {
          return null;
        }

        const professor = await prisma.professor.findUnique({ where: { nome } });
        if (!professor) return null;

        const senhaValida = await bcrypt.compare(codigo, professor.codigoHash);
        if (!senhaValida) return null;

        return {
          id: professor.id,
          name: professor.nome,
          perfil: professor.perfil,
          unidade: professor.unidade,
          componentes: professor.componentes,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.perfil = user.perfil;
        token.unidade = user.unidade;
        token.componentes = user.componentes;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.perfil = token.perfil;
      session.user.unidade = token.unidade;
      session.user.componentes = token.componentes;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      await registrarAcao(
        { user: { id: user.id!, name: user.name ?? "" } },
        "login",
        `Login de ${user.name}.`
      );
    },
  },
});
