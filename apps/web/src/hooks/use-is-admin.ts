import { authClient } from "@/lib/auth-client";
import type { User } from "better-auth";
import React from "react";

const useIsAdmin = (user: User) => {
  if (!(user.role === "ADMIN")) {
    return false;
  }

  return true;
};

export default useIsAdmin;
