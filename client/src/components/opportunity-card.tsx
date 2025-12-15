import { Link } from "wouter";
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Building2, Briefcase, GraduationCap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import type { Opportunity, Company } from "@shared/schema";

interface OpportunityCardProps {
  opportunity: Opportunity & { company?: Company };
  isSaved?: boolean;
  onSave?: () => void;
}

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

export function OpportunityCard({ opportunity, isSaved = false, onSave }: OpportunityCardProps) {
  const { t } = useTranslation();
  const TypeIcon = typeIcons[opportunity.type as keyof typeof typeIcons] || Briefcase;
  const typeColor = typeColors[opportunity.type as keyof typeof typeColors] || typeColors.job;

  const formatSalary = () => {
    if (!opportunity.salaryMin && !opportunity.salaryMax) return null;
    if (opportunity.salaryMin && opportunity.salaryMax) {
      return `${opportunity.salaryMin} - ${opportunity.salaryMax} ${opportunity.currency}`;
    }
    return `${opportunity.salaryMin || opportunity.salaryMax} ${opportunity.currency}`;
  };

  const salary = formatSalary();

  return (
    <Card className="group hover-elevate transition-all duration-200" data-testid={`card-opportunity-${opportunity.id}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0">
            {opportunity.company?.logo ? (
              <img
                src={opportunity.company.logo}
                alt={opportunity.company.name}
                className="w-14 h-14 rounded-md object-cover bg-muted"
              />
            ) : (
              <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/opportunities/${opportunity.id}`}>
                  <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors" data-testid={`text-opportunity-title-${opportunity.id}`}>
                    {opportunity.title}
                  </h3>
                </Link>
                {opportunity.company && (
                  <Link href={`/companies/${opportunity.company.id}`}>
                    <p className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`text-company-name-${opportunity.id}`}>
                      {opportunity.company.name}
                    </p>
                  </Link>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onSave}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ visibility: "visible" }}
                data-testid={`button-save-${opportunity.id}`}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="secondary" className={typeColor}>
                <TypeIcon className="h-3 w-3 me-1" />
                {t(opportunity.type)}
              </Badge>

              {opportunity.province && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {t(opportunity.province)}
                </Badge>
              )}

              {opportunity.experienceLevel && (
                <Badge variant="outline">{opportunity.experienceLevel}</Badge>
              )}
            </div>

            {(salary || opportunity.deadline) && (
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {salary && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {salary}
                  </span>
                )}
                {opportunity.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <span className="text-xs text-muted-foreground">
                {opportunity.createdAt && new Date(opportunity.createdAt).toLocaleDateString()}
              </span>
              <Link href={`/opportunities/${opportunity.id}`}>
                <Button size="sm" data-testid={`button-apply-${opportunity.id}`}>
                  {t("apply")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
