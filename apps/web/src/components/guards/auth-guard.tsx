import { authClient } from "@/lib/auth-client";
import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router";

const AuthGuard = ({ children }: PropsWithChildren) => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }

    if (session && session.user.role !== "ADMIN") {
      navigate("/");
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return children;
};

export default AuthGuard;
