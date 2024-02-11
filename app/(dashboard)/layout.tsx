import Logo from "@/components/logo";
import ThemeSwitcher from "@/components/theme-switcher";
import { UserButton } from "@clerk/nextjs";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex-center-between border-b h-[60px] px-4 py-2">
        <Logo />
        <div className="flex-align-center gap-4">
          <ThemeSwitcher />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
};

export default DashboardLayout;
