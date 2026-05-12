import LoginFormWrapper from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const rt = typeof sp.return_to === "string" ? sp.return_to : "/";
  return <LoginFormWrapper initialReturn={rt.startsWith("/") ? rt : "/"} />;
}
