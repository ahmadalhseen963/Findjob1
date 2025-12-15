import { Link, useParams } from "wouter";
import { 
  Building2, MapPin, Globe, Users, Calendar, CheckCircle2,
  ArrowLeft, ArrowRight, Briefcase, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-translation";
import { OpportunityCard } from "@/components/opportunity-card";

const mockCompany = {
  id: "1",
  name: "شركة التقنية المتقدمة",
  nameEn: "Advanced Tech Company",
  logo: null,
  coverImage: null,
  description: "شركة رائدة في مجال تطوير البرمجيات والحلول التقنية في سوريا. نقدم خدمات متكاملة في مجال تطوير تطبيقات الويب والموبايل والأنظمة المؤسسية.",
  descriptionEn: "A leading company in software development and technology solutions in Syria. We provide comprehensive services in web, mobile, and enterprise system development.",
  website: "https://advancedtech.sy",
  industry: "تقنية المعلومات",
  employeeCount: "50-100",
  province: "damascus" as const,
  address: "دمشق، شارع الحمرا",
  foundedYear: 2015,
  isVerified: true,
};

const mockOpportunities = Array.from({ length: 4 }, (_, i) => ({
  id: String(i + 1),
  title: i % 2 === 0 ? "مهندس برمجيات" : "مصمم UI/UX",
  type: "job" as const,
  province: "damascus" as const,
  salaryMin: 600 + i * 100,
  salaryMax: 1200 + i * 100,
  currency: "USD",
  experienceLevel: i % 2 === 0 ? "3-5 سنوات" : "1-2 سنوات",
  deadline: new Date(Date.now() + (30 - i * 5) * 24 * 60 * 60 * 1000),
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  company: { id: "1", name: mockCompany.name, logo: null },
}));

export default function CompanyProfile() {
  const { t, dir, language } = useTranslation();
  const params = useParams<{ id: string }>();

  const company = mockCompany;
  const name = language === "ar" ? company.name : company.nameEn || company.name;
  const description = language === "ar" ? company.description : company.descriptionEn || company.description;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/jobs">
        <Button variant="ghost" className="mb-4" data-testid="button-back">
          {dir === "rtl" ? <ArrowRight className="h-4 w-4 me-2" /> : <ArrowLeft className="h-4 w-4 me-2" />}
          {t("back")}
        </Button>
      </Link>

      <div className="mb-8">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg mb-6" />
        
        <div className="flex flex-wrap items-start gap-6 -mt-16 px-4">
          {company.logo ? (
            <Avatar className="h-24 w-24 rounded-md border-4 border-background shadow-lg">
              <AvatarImage src={company.logo} />
              <AvatarFallback><Building2 className="h-12 w-12" /></AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-24 w-24 rounded-md bg-card border-4 border-background shadow-lg flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 pt-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold" data-testid="text-company-name">{name}</h1>
              {company.isVerified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-4">{company.industry}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {t(company.province)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                {company.employeeCount} {t("totalUsers")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {company.foundedYear}
              </span>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-8">
            <Button data-testid="button-contact">
              <Mail className="h-4 w-4 me-2" />
              {t("footer.contact")}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="about">
        <TabsList className="mb-6">
          <TabsTrigger value="about" data-testid="tab-about">
            {t("aboutCompany")}
          </TabsTrigger>
          <TabsTrigger value="opportunities" data-testid="tab-opportunities">
            <Briefcase className="h-4 w-4 me-2" />
            {t("jobs")} ({mockOpportunities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("aboutCompany")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{description}</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("statistics")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("totalJobs")}</span>
                    <span className="font-bold">{mockOpportunities.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("totalUsers")}</span>
                    <span className="font-bold">{company.employeeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-bold">{company.foundedYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("location")}</span>
                    <span className="font-bold">{t(company.province)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          {mockOpportunities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t("noResults")}</h3>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity as any} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
