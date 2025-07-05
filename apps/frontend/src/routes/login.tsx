import { Button } from "@frontend/components/ui/button";
import { useAuth } from "@frontend/hooks/useAuth";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@repo/backend/validators/login";
import type { Login } from "@repo/backend/types/login";
import { toast } from "sonner";
import { LabeledInput } from "@frontend/components/labeled-input";
import { Lock, Mail } from "lucide-react";
import { getZodFormFieldErrors } from "@frontend/lib/forms";
import { useEffect } from "react";
import type { FileRouteTypes } from "@frontend/routeTree.gen";

interface Search {
  goto: string | undefined;
}

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  validateSearch: (search): Search => {
    return {
      goto: search.goto as FileRouteTypes["to"],
    }
  }
});

function RouteComponent() {
  const { user, login } = useAuth();
  const { goto } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate({
        to: (goto ?? "/") as FileRouteTypes["to"],
        replace: true,
        from: "/login"
      });
    }
  }, [user, goto, navigate]);


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies Login,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value: { email, password } }) => {
      const error = await login(email, password);
      if (error) {
        toast.error(error);
      } else {
        router.invalidate();
      }
    },
  });

  return (
    <div className="flex h-dvh items-center justify-center animate-page-in">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-2 p-4 bg-surface-1 not-dark:bg-surface-3 rounded-2xl w-sm border border-muted"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-2">
          <div className="h-px bg-muted" />
          <h1 className="text-center font-bold text-xl">Login</h1>
          <div className="h-px bg-muted" />
        </div>
        <h2 className="text-center text-sm text-muted-foreground mb-2">
          Welcome back! Please login to continue.
        </h2>
        <form.Field
          name="email"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <LabeledInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="email"
              label="Email"
              placeholder="Email"
              aria-errormessage={getZodFormFieldErrors(field)}
              icon={Mail}
            />
          )}
        />
        <form.Field
          name="password"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => (
            <LabeledInput
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="password"
              label="Password"
              placeholder="Password"
              aria-errormessage={getZodFormFieldErrors(field)}
              icon={Lock}
            />
          )}
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
