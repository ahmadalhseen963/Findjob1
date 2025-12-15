import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Search, Bell, MessageSquare, User, Briefcase, GraduationCap, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "./language-selector";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/lib/store";
import logoImage from "@assets/5983299235203893086_120_1765260787386.jpg";

const navLinks = [
  { key: "home", href: "/", icon: null },
  { key: "jobs", href: "/jobs", icon: Briefcase },
  { key: "training", href: "/training", icon: GraduationCap },
  { key: "volunteer", href: "/volunteer", icon: Heart },
  { key: "provinces", href: "/provinces", icon: MapPin },
];

export function Header() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user, isAuthenticated } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
              <img src={logoImage} alt="Find Job Syria" className="h-10 w-10 rounded-md object-cover" />
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-primary">{t("siteName")}</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.key} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    size="sm"
                    data-testid={`nav-link-${link.key}`}
                  >
                    {link.icon && <link.icon className="h-4 w-4 me-1" />}
                    {t(link.key)}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 w-full"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" data-testid="button-notifications" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -end-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-messages">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="button-user-menu">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem data-testid="menu-item-profile">
                      <Link href="/profile">{t("profile")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-item-dashboard">
                      <Link href="/dashboard">{t("dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="menu-item-logout">
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="button-register">
                    {t("register")}
                  </Button>
                </Link>
              </div>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="start" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchPlaceholder")}
                      className="ps-10"
                      data-testid="input-mobile-search"
                    />
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link key={link.key} href={link.href}>
                        <Button
                          variant={location === link.href ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid={`mobile-nav-link-${link.key}`}
                        >
                          {link.icon && <link.icon className="h-4 w-4 me-2" />}
                          {t(link.key)}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  {!isAuthenticated && (
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                      <Link href="/login">
                        <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          {t("register")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
