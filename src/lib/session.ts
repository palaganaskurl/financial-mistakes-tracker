import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

type SessionData = {
  userId?: string;
  username?: string;
  name?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: process.env.SESSION_SECRET!,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();

    if (!session.data.userId) {
      return null;
    }

    return {
      id: session.data.userId,
      username: session.data.username,
      name: session.data.name,
    };
  },
);

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
});
