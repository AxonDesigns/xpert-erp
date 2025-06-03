import { getRoles } from "@frontend/domain/roles";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_protected/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    getRoles().then((data) => {
      console.log(data.data);
    });
  }, []);

  return (
    <main className="flex justify-center items-center bg-surface-1 animate-page-in flex-1 rounded-lg">
      <h1>HOLA</h1>
    </main>
  );
}
