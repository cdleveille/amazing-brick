import { createFileRoute } from "@tanstack/react-router";

import { Main } from "@/client/components/Main";

export const Route = createFileRoute("/")({
  component: Main,
});
