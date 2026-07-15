"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-paper-2 hover:text-ink"
    >
      Sair
    </button>
  );
}
