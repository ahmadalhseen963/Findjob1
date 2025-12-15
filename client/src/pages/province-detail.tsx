import { Link, useParams } from "wouter";
import { MapPin, Briefcase, Building2, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { OpportunityCard } from "@/components/opportunity-card";
import { syrianProvinces, type Province } from "@shared/schema";

const mockOpportunities = (province: string) => Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  title: i % 3 === 0 ? "مهندس برمجيات" : i % 3 === 1 ? "مدير تسويق" : "محاسب مالي",
  type: (i % 3 === 0 ? "job" : i % 3 === 1 ? "training" : "volunteer") as "job" | "training" | "volunteer",
  province: province as Province,
  salaryMin: i % 3 === 0 ? 500 + i * 100 : undefined,
  salaryMax: i % 3 === 0 ? 1000 + i * 150 : undefined,
  currency: "USD",
  experienceLevel: i % 2 === 0 ? "3-5 سنوات" : "1-2 سنوات",
  deadline: new Date(Date.now() + (30 - i * 2) * 24 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  company: { 
    id: String(i + 1), 
    name: i % 3 === 0 ? "شركة التقنية" : i % 3 === 1 ? "مركز التدريب" : "منظمة الإغاثة",
    logo: null 
  },
}));

export default function ProvinceDetail() {
  const { t, dir } = useTranslation();
  const params = useParams<{ province: string }>();
  const province = params.province;

  if (!province || !syrianProvinces.includes(province as any)) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("error")}</h1>
        <Link href="/provinces">
          <Button>{t("back")}</Button>
        </Link>
      </div>
    );
  }

  const opportunities = mockOpportunities(province);
  const jobs = opportunities.filter(o => o.type === "job");
  const trainings = opportunities.filter(o => o.type === "training");
  const volunteers = opportunities.filter(o => o.type === "volunteer");

  const stats = [
    { icon: Briefcase, value: jobs.length, label: t("jobs") },
    { icon: Building2, value: Math.floor(Math.random() * 50) + 10, label: t("totalCompanies") },
    { icon: Users, value: Math.floor(Math.random() * 500) + 100, label: t("individual") },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/provinces">
        <Button variant="ghost" className="mb-4" data-testid="button-back">
          {dir === "rtl" ? <ArrowRight className="h-4 w-4 me-2" /> : <ArrowLeft className="h-4 w-4 me-2" />}
          {t("back")}
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-province-name">{t(province)}</h1>
            <p className="text-muted-foreground">{t("opportunitiesIn")} {t(province)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all" data-testid="tab-all">
            {t("viewAll")} ({opportunities.length})
          </TabsTrigger>
          <TabsTrigger value="jobs" data-testid="tab-jobs">
            {t("jobs")} ({jobs.length})
          </TabsTrigger>
          <TabsTrigger value="training" data-testid="tab-training">
            {t("training")} ({trainings.length})
          </TabsTrigger>
          <TabsTrigger value="volunteer" data-testid="tab-volunteer">
            {t("volunteer")} ({volunteers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity as any} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity as any} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainings.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity as any} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volunteer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {volunteers.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity as any} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
