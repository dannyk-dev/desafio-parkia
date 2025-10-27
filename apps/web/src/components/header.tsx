import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";

export default function Header() {
  const { data: session } = authClient.useSession();
  console.log(session?.user);

  const links = useMemo(() => {
    const baseLinks = [{ to: "/", label: "Home", public: true }];

    if (session?.user.role === "ADMIN") {
      baseLinks.push({ to: "/admin", label: "Admin Dashboard", public: false });
    }

    return baseLinks;
  }, [session]);

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "font-bold" : "")} end>
                {label}
              </NavLink>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
