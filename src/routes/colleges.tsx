import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/colleges")({
  component: CollegesLayout,
});

function CollegesLayout() {
  return <Outlet />;
}