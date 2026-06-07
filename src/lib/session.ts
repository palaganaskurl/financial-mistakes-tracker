import { createServerFn } from "@tanstack/react-start";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const { useAppSession } = await import("@/lib/session.server");
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
  const { useAppSession } = await import("@/lib/session.server");
  const session = await useAppSession();
  await session.clear();
});
