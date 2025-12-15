import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { OpportunityCard } from "@/components/opportunity-card";
import { syrianProvinces, type Opportunity } from "@shared/schema";

const categories = [
  "technology", "engineering", "marketing", "sales", "finance", 
  "healthcare", "education", "hospitality", "construction", "other"
];

const experienceLevels = ["entry", "junior", "mid", "senior", "executive"];

export default function Jobs() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: opportunities = [], isLoading } = useQuery<Opportunity[]>({
    queryKey: ['/api/opportunities', { type: 'job', province: selectedProvince !== 'all' ? selectedProvince : undefined, category: selectedCategory !== 'all' ? selectedCategory : undefined, search: searchQuery || undefined, status: 'approved' }],
  });

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    if (filter.startsWith("province:")) setSelectedProvince("all");
    if (filter.startsWith("category:")) setSelectedCategory("all");
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedProvince("all");
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">{t("location")}</Label>
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger data-testid="select-province">
            <SelectValue placeholder={t("allProvinces")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allProvinces")}</SelectItem>
            {syrianProvinces.map((province) => (
              <SelectItem key={province} value={province}>
                {t(province)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">{t("experience")}</Label>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox id={`exp-${level}`} data-testid={`checkbox-exp-${level}`} />
              <Label htmlFor={`exp-${level}`} className="text-sm font-normal cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">{t("allCategories")}</Label>
        <div className="space-y-2">
          {categories.slice(0, 5).map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox id={`cat-${category}`} data-testid={`checkbox-cat-${category}`} />
              <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">{t("jobs")}</h1>
        <p className="text-muted-foreground">{t("searchPlaceholder")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-72 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                {t("filterBy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10"
                data-testid="input-jobs-search"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("newest")}</SelectItem>
                <SelectItem value="relevant">{t("relevant")}</SelectItem>
                <SelectItem value="salary">{t("highestSalary")}</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" data-testid="button-mobile-filters">
                  <SlidersHorizontal className="h-4 w-4 me-2" />
                  {t("filterBy")}
                </Button>
              </SheetTrigger>
              <SheetContent side="start">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t("filterBy")}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="ms-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} data-testid="button-clear-filters">
                {t("cancel")}
              </Button>
            </div>
          )}

          <div className="mb-4 text-sm text-muted-foreground">
            {opportunities.length} {t("jobs")}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t("noResults")}</h3>
                <p className="text-muted-foreground">{t("tryAgain")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity as any}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
