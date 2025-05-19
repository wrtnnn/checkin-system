import "@/styles/globals.css";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import { UserProvider } from "./context/UserContext";

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  
  const res = await fetch('http://localhost:8080/users');
  const users = await res.json();

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <UserProvider>
          <nav className="flex justify-between items-center px-[40px] 2xl:px-[100px] py-[10px] 2xl:py-[30px] border-b border-[#0000002]">
            <p className="text-header">Check In</p>
            <div className="text-end">
              <p className="text-[#282828] text-title text-[#282828]">{users[0]?.name}</p>
              <p className="text-subtitle hidden 2xl:inline">{users[0]?.role?.en}</p>
            </div>
          </nav>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
