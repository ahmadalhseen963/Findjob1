import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Jobs from "@/pages/jobs";
import Training from "@/pages/training";
import Volunteer from "@/pages/volunteer";
import Provinces from "@/pages/provinces";
import ProvinceDetail from "@/pages/province-detail";
import OpportunityDetail from "@/pages/opportunity-detail";
import CompanyProfile from "@/pages/company-profile";
import CvBuilder from "@/pages/cv-builder";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import Messages from "@/pages/messages";
import Login from "@/pages/login";
import Register from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/training" component={Training} />
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/provinces" component={Provinces} />
      <Route path="/provinces/:province" component={ProvinceDetail} />
      <Route path="/opportunities/:id" component={OpportunityDetail} />
      <Route path="/companies/:id" component={CompanyProfile} />
      <Route path="/cv-builder" component={CvBuilder} />
      <Route path="/profile" component={Profile} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/messages" component={Messages} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { theme, language } = useAppStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const dir = ["ar"].includes(language) ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [theme, language]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
