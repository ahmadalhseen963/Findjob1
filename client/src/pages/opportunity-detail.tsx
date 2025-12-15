import { Link, useParams } from "wouter";
import { 
  MapPin, Clock, DollarSign, Building2, Briefcase, GraduationCap, Heart,
  ArrowLeft, ArrowRight, Calendar, Users, BookmarkPlus, Share2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-translation";

const typeIcons = {
  job: Briefcase,
  training: GraduationCap,
  volunteer: Heart,
};

const typeColors = {
  job: "bg-primary/10 text-primary",
  training: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  volunteer: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

const mockOpportunity = {
  id: "1",
  title: "مهندس برمجيات أول",
  titleEn: "Senior Software Engineer",
  description: "نبحث عن مهندس برمجيات خبير للانضمام إلى فريقنا. ستكون مسؤولاً عن تطوير وصيانة تطبيقات الويب والموبايل باستخدام أحدث التقنيات.",
  descriptionEn: "We are looking for an experienced software engineer to join our team. You will be responsible for developing and maintaining web and mobile applications using the latest technologies.",
  type: "job" as const,
  province: "damascus" as const,
  category: "technology",
  requirements: "خبرة 3-5 سنوات في تطوير البرمجيات\nإتقان JavaScript/TypeScript\nخبرة في React و Node.js\nمهارات حل المشكلات",
  benefits: "راتب تنافسي\nتأمين صحي\nبيئة عمل مرنة\nفرص للتطور المهني",
  salaryMin: 800,
  salaryMax: 1500,
  currency: "USD",
  experienceLevel: "3-5 سنوات",
  educationLevel: "بكالوريوس",
  employmentType: "دوام كامل",
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  viewCount: 245,
  applicationCount: 32,
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  company: {
    id: "1",
    name: "شركة التقنية المتقدمة",
    nameEn: "Advanced Tech Company",
    logo: null,
    description: "شركة رائدة في مجال تطوير البرمجيات والحلول التقنية في سوريا.",
    industry: "تقنية المعلومات",
    employeeCount: "50-100",
    province: "damascus" as const,
    isVerified: true,
  },
};

export default function OpportunityDetail() {
  const { t, dir, language } = useTranslation();
  const params = useParams<{ id: string }>();

  const opportunity = mockOpportunity;
  const TypeIcon = typeIcons[opportunity.type];
  const typeColor = typeColors[opportunity.type];

  const title = language === "ar" ? opportunity.title : opportunity.titleEn || opportunity.title;
  const description = language === "ar" ? opportunity.description : opportunity.descriptionEn || opportunity.description;

  const formatSalary = () => {
    if (!opportunity.salaryMin && !opportunity.salaryMax) return null;
    if (opportunity.salaryMin && opportunity.salaryMax) {
      return `${opportunity.salaryMin} - ${opportunity.salaryMax} ${opportunity.currency}`;
    }
    return `${opportunity.salaryMin || opportunity.salaryMax} ${opportunity.currency}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/jobs">
        <Button variant="ghost" className="mb-4" data-testid="button-back">
          {dir === "rtl" ? <ArrowRight className="h-4 w-4 me-2" /> : <ArrowLeft className="h-4 w-4 me-2" />}
          {t("back")}
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex gap-4">
                  {opportunity.company.logo ? (
                    <Avatar className="h-16 w-16 rounded-md">
                      <AvatarImage src={opportunity.company.logo} />
                      <AvatarFallback><Building2 className="h-8 w-8" /></AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold mb-1" data-testid="text-opportunity-title">{title}</h1>
                    <Link href={`/companies/${opportunity.company.id}`}>
                      <p className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                        {opportunity.company.name}
                        {opportunity.company.isVerified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon" data-testid="button-save">
                    <BookmarkPlus className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className={typeColor}>
                  <TypeIcon className="h-3 w-3 me-1" />
                  {t(opportunity.type)}
                </Badge>
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 me-1" />
                  {t(opportunity.province)}
                </Badge>
                {opportunity.experienceLevel && (
                  <Badge variant="outline">{opportunity.experienceLevel}</Badge>
                )}
                {opportunity.employmentType && (
                  <Badge variant="outline">{opportunity.employmentType}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                {formatSalary() && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatSalary()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{opportunity.applicationCount} {t("totalApplications")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(opportunity.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <Button className="w-full sm:w-auto" size="lg" data-testid="button-apply">
                {t("apply")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("description")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{description}</p>
            </CardContent>
          </Card>

          {opportunity.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>{t("requirements")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.requirements.split("\n").map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {opportunity.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>{t("benefits")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.benefits.split("\n").map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("aboutCompany")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {opportunity.company.logo ? (
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={opportunity.company.logo} />
                    <AvatarFallback><Building2 /></AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold flex items-center gap-1">
                    {opportunity.company.name}
                    {opportunity.company.isVerified && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">{opportunity.company.industry}</p>
                </div>
              </div>

              <Separator />

              <p className="text-sm">{opportunity.company.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{t(opportunity.company.province)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{opportunity.company.employeeCount} {t("totalUsers")}</span>
                </div>
              </div>

              <Link href={`/companies/${opportunity.company.id}`}>
                <Button variant="outline" className="w-full" data-testid="button-view-company">
                  {t("companyProfile")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
