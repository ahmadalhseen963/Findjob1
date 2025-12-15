import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Briefcase, GraduationCap, Heart, Building2, Users, FileText, Sparkles, ArrowLeft, ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { OpportunityCard } from "@/components/opportunity-card";
import { type Opportunity } from "@shared/schema";
import logoImage from "@assets/5983299235203893086_120_1765260787386.jpg";

const provinces = [
  { key: "damascus", jobs: 245 },
  { key: "aleppo", jobs: 189 },
  { key: "homs", jobs: 87 },
  { key: "latakia", jobs: 76 },
  { key: "hama", jobs: 54 },
  { key: "tartus", jobs: 43 },
  { key: "deir_ez_zor", jobs: 32 },
  { key: "raqqa", jobs: 28 },
];

type StatsData = {
  totalJobs: number;
  totalUsers: number;
  totalCompanies: number;
  totalApplications: number;
};

export default function Home() {
  const { t, dir } = useTranslation();

  const { data: statsData } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  const { data: latestOpportunities = [], isLoading: isLoadingOpportunities } = useQuery<Opportunity[]>({
    queryKey: ['/api/opportunities', { status: 'approved', limit: 6 }],
  });

  const stats = [
    { icon: Briefcase, value: statsData?.totalJobs?.toLocaleString() ?? "0", key: "totalJobs" },
    { icon: Users, value: statsData?.totalUsers?.toLocaleString() ?? "0", key: "totalUsers" },
    { icon: Building2, value: statsData?.totalCompanies?.toLocaleString() ?? "0", key: "totalCompanies" },
    { icon: FileText, value: statsData?.totalApplications?.toLocaleString() ?? "0", key: "totalApplications" },
  ];

  const seekerSteps = [
    { icon: FileText, title: t("createProfile"), desc: t("buildATSCV") },
    { icon: Search, title: t("browseJobs"), desc: t("applyToJobs") },
    { icon: CheckCircle2, title: t("apply"), desc: t("getHired") },
  ];

  const employerSteps = [
    { icon: Building2, title: t("companyProfile"), desc: t("postOpportunity") },
    { icon: Users, title: t("receiveApplications"), desc: t("aiScreening") },
    { icon: Sparkles, title: t("aiPowered"), desc: t("hireTheBest") },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 start-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 end-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src={logoImage} alt="Find Job Syria" className="h-24 w-24 rounded-xl shadow-lg" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
              {t("findYourDreamJob")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="ps-12 h-12 text-base"
                  data-testid="input-hero-search"
                />
              </div>
              <Button size="lg" className="h-12" data-testid="button-hero-search">
                {t("search")}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/jobs">
                <Button variant="outline" size="lg" data-testid="button-browse-jobs">
                  <Briefcase className="h-5 w-5 me-2" />
                  {t("browseJobs")}
                </Button>
              </Link>
              <Link href="/register?type=employer">
                <Button variant="secondary" size="lg" data-testid="button-post-job">
                  <Building2 className="h-5 w-5 me-2" />
                  {t("postJob")}
                  <Badge variant="outline" className="ms-2 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] border-0">
                    {t("pricePerPost")}
                  </Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl md:text-3xl font-bold" data-testid={`stat-${stat.key}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{t(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" data-testid="text-latest-opportunities">
              {t("latestOpportunities")}
            </h2>
            <Link href="/jobs">
              <Button variant="outline" data-testid="button-view-all">
                {t("viewAll")}
                {dir === "rtl" ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingOpportunities ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-14 h-14 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-3">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : latestOpportunities.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{t("noResults")}</h3>
                </CardContent>
              </Card>
            ) : (
              latestOpportunities.slice(0, 3).map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity as any}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" data-testid="text-provinces-title">
            {t("provinces")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {provinces.map((province) => (
              <Link key={province.key} href={`/provinces/${province.key}`}>
                <Card className="hover-elevate cursor-pointer" data-testid={`card-province-${province.key}`}>
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">{t(province.key)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {province.jobs} {t("jobs")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/provinces">
              <Button variant="outline" data-testid="button-all-provinces">
                {t("viewAll")} {t("provinces")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" data-testid="text-how-it-works">
            {t("howItWorks")}
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t("forJobSeekers")}
              </h3>
              <div className="space-y-6">
                {seekerSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                {t("forEmployers")}
              </h3>
              <div className="space-y-6">
                {employerSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t("aiPowered")}
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="secondary" data-testid="button-cta-register">
                {t("register")}
              </Button>
            </Link>
            <Link href="/cv-builder">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-cv">
                {t("buildCV")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
