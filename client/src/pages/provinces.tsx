import { Link } from "wouter";
import { MapPin, Briefcase, Building2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { syrianProvinces } from "@shared/schema";

const provinceData = syrianProvinces.map((province, i) => ({
  key: province,
  jobs: Math.floor(Math.random() * 200) + 20,
  companies: Math.floor(Math.random() * 50) + 10,
  seekers: Math.floor(Math.random() * 500) + 100,
}));

export default function Provinces() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold" data-testid="text-page-title">{t("provinces")}</h1>
        </div>
        <p className="text-muted-foreground">
          {t("opportunitiesIn")} {t("provinces")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {provinceData.map((province) => (
          <Link key={province.key} href={`/provinces/${province.key}`}>
            <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-province-${province.key}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{t(province.key)}</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {t("jobs")}
                    </span>
                    <span className="font-medium">{province.jobs}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {t("totalCompanies")}
                    </span>
                    <span className="font-medium">{province.companies}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {t("individual")}
                    </span>
                    <span className="font-medium">{province.seekers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
