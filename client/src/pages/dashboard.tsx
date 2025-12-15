import { Link } from "wouter";
import { 
  Users, Briefcase, Building2, FileText, TrendingUp, Eye, 
  CheckCircle2, Clock, XCircle, Plus, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/lib/store";

const mockStats = {
  totalJobs: 12,
  totalApplications: 156,
  totalViews: 2450,
  pendingReview: 23,
};

const mockOpportunities = [
  { id: "1", title: "مهندس برمجيات", applications: 45, views: 320, status: "approved", createdAt: "2024-01-15" },
  { id: "2", title: "مدير مشروع", applications: 28, views: 180, status: "pending", createdAt: "2024-01-12" },
  { id: "3", title: "محاسب مالي", applications: 56, views: 420, status: "approved", createdAt: "2024-01-10" },
  { id: "4", title: "مصمم جرافيك", applications: 12, views: 95, status: "rejected", createdAt: "2024-01-08" },
];

const mockApplications = [
  { id: "1", name: "أحمد محمد", job: "مهندس برمجيات", status: "pending", date: "2024-01-18", score: 85 },
  { id: "2", name: "سارة أحمد", job: "مهندس برمجيات", status: "shortlisted", date: "2024-01-17", score: 92 },
  { id: "3", name: "محمد علي", job: "مدير مشروع", status: "reviewed", date: "2024-01-16", score: 78 },
  { id: "4", name: "فاطمة حسن", job: "محاسب مالي", status: "accepted", date: "2024-01-15", score: 88 },
];

const statusIcons: Record<string, any> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  reviewed: Eye,
  shortlisted: TrendingUp,
  accepted: CheckCircle2,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  approved: "bg-green-500/10 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
  reviewed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  shortlisted: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  accepted: "bg-primary/10 text-primary",
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">{t("login")}</h1>
        <p className="text-muted-foreground mb-6">Please login to access the dashboard</p>
        <Link href="/login">
          <Button data-testid="button-go-login">{t("login")}</Button>
        </Link>
      </div>
    );
  }

  const stats = [
    { icon: Briefcase, value: mockStats.totalJobs, label: t("totalJobs"), color: "text-primary" },
    { icon: FileText, value: mockStats.totalApplications, label: t("totalApplications"), color: "text-blue-500" },
    { icon: Eye, value: mockStats.totalViews, label: "Views", color: "text-green-500" },
    { icon: Clock, value: mockStats.pendingReview, label: t("pending"), color: "text-yellow-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{t("recentActivity")}</p>
        </div>
        <Link href="/post-opportunity">
          <Button data-testid="button-post-job">
            <Plus className="h-4 w-4 me-2" />
            {t("postJob")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="opportunities">
        <TabsList className="mb-6">
          <TabsTrigger value="opportunities" data-testid="tab-opportunities">
            <Briefcase className="h-4 w-4 me-2" />
            {t("jobs")}
          </TabsTrigger>
          <TabsTrigger value="applications" data-testid="tab-applications">
            <FileText className="h-4 w-4 me-2" />
            {t("totalApplications")}
          </TabsTrigger>
          <TabsTrigger value="company" data-testid="tab-company">
            <Building2 className="h-4 w-4 me-2" />
            {t("companyProfile")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>{t("manageJobs")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-start border-b">
                      <th className="pb-3 font-medium text-muted-foreground">Title</th>
                      <th className="pb-3 font-medium text-muted-foreground">{t("totalApplications")}</th>
                      <th className="pb-3 font-medium text-muted-foreground">Views</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOpportunities.map((opp) => {
                      const StatusIcon = statusIcons[opp.status];
                      return (
                        <tr key={opp.id} className="border-b last:border-0" data-testid={`row-opportunity-${opp.id}`}>
                          <td className="py-4">
                            <Link href={`/opportunities/${opp.id}`} className="font-medium hover:text-primary">
                              {opp.title}
                            </Link>
                          </td>
                          <td className="py-4">{opp.applications}</td>
                          <td className="py-4">{opp.views}</td>
                          <td className="py-4">
                            <Badge className={statusColors[opp.status]}>
                              <StatusIcon className="h-3 w-3 me-1" />
                              {t(opp.status)}
                            </Badge>
                          </td>
                          <td className="py-4 text-muted-foreground">{opp.createdAt}</td>
                          <td className="py-4">
                            <Button variant="ghost" size="sm" data-testid={`button-edit-${opp.id}`}>
                              {t("edit")}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>{t("totalApplications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-start border-b">
                      <th className="pb-3 font-medium text-muted-foreground">Applicant</th>
                      <th className="pb-3 font-medium text-muted-foreground">Position</th>
                      <th className="pb-3 font-medium text-muted-foreground">AI Score</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockApplications.map((app) => {
                      const StatusIcon = statusIcons[app.status];
                      return (
                        <tr key={app.id} className="border-b last:border-0" data-testid={`row-application-${app.id}`}>
                          <td className="py-4 font-medium">{app.name}</td>
                          <td className="py-4 text-muted-foreground">{app.job}</td>
                          <td className="py-4">
                            <Badge variant="outline" className={app.score >= 80 ? "text-green-600" : app.score >= 60 ? "text-yellow-600" : "text-red-600"}>
                              {app.score}%
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge className={statusColors[app.status]}>
                              <StatusIcon className="h-3 w-3 me-1" />
                              {t(app.status)}
                            </Badge>
                          </td>
                          <td className="py-4 text-muted-foreground">{app.date}</td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" data-testid={`button-view-app-${app.id}`}>
                                {t("view")}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>{t("companyProfile")}</CardTitle>
              <Button variant="outline" size="sm" data-testid="button-edit-company">
                <Settings className="h-4 w-4 me-2" />
                {t("edit")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">شركة التقنية المتقدمة</h3>
                  <p className="text-muted-foreground mb-4">شركة رائدة في مجال تطوير البرمجيات والحلول التقنية</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <Badge variant="outline">تقنية المعلومات</Badge>
                    <Badge variant="outline">50-100 موظف</Badge>
                    <Badge variant="outline">{t("damascus")}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
