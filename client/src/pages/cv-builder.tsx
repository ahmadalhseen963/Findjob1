import { useState } from "react";
import { FileText, User, Briefcase, GraduationCap, Languages, Award, Download, Eye, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { syrianProvinces } from "@shared/schema";

const steps = [
  { key: "personalInfo", icon: User },
  { key: "workExperience", icon: Briefcase },
  { key: "educationHistory", icon: GraduationCap },
  { key: "skillsAndLanguages", icon: Languages },
  { key: "preview", icon: Eye },
];

export default function CvBuilder() {
  const { t, dir } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    summary: "",
    experiences: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
    educations: [{ degree: "", institution: "", year: "", field: "" }],
    skills: "",
    languages: "",
    certifications: "",
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateField = (field: string, value: any) => {
    setCvData({ ...cvData, [field]: value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold" data-testid="text-page-title">{t("cvBuilder")}</h1>
          </div>
          <p className="text-muted-foreground mb-4">{t("buildATSCV")}</p>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {t("atsOptimized")}
          </Badge>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {t("step")} {currentStep + 1} {t("of")} {steps.length}
            </span>
            <span className="text-sm font-medium">{t(steps[currentStep].key)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.key}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <StepIcon className="h-5 w-5" />
              </div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep].icon;
                return <StepIcon className="h-5 w-5" />;
              })()}
              {t(steps[currentStep].key)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("fullName")}</Label>
                    <Input
                      id="fullName"
                      value={cvData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cvData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={cvData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("location")}</Label>
                    <Select value={cvData.province} onValueChange={(v) => updateField("province", v)}>
                      <SelectTrigger data-testid="select-province">
                        <SelectValue placeholder={t("allProvinces")} />
                      </SelectTrigger>
                      <SelectContent>
                        {syrianProvinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {t(province)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summary">{t("description")}</Label>
                  <Textarea
                    id="summary"
                    value={cvData.summary}
                    onChange={(e) => updateField("summary", e.target.value)}
                    className="min-h-[100px]"
                    data-testid="textarea-summary"
                  />
                </div>
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                {cvData.experiences.map((exp, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...cvData.experiences];
                              newExp[index].title = e.target.value;
                              updateField("experiences", newExp);
                            }}
                            data-testid={`input-exp-title-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...cvData.experiences];
                              newExp[index].company = e.target.value;
                              updateField("experiences", newExp);
                            }}
                            data-testid={`input-exp-company-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const newExp = [...cvData.experiences];
                              newExp[index].startDate = e.target.value;
                              updateField("experiences", newExp);
                            }}
                            data-testid={`input-exp-start-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => {
                              const newExp = [...cvData.experiences];
                              newExp[index].endDate = e.target.value;
                              updateField("experiences", newExp);
                            }}
                            data-testid={`input-exp-end-${index}`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("description")}</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...cvData.experiences];
                            newExp[index].description = e.target.value;
                            updateField("experiences", newExp);
                          }}
                          data-testid={`textarea-exp-desc-${index}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => updateField("experiences", [...cvData.experiences, { title: "", company: "", startDate: "", endDate: "", description: "" }])}
                  data-testid="button-add-experience"
                >
                  + Add Experience
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {cvData.educations.map((edu, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...cvData.educations];
                              newEdu[index].degree = e.target.value;
                              updateField("educations", newEdu);
                            }}
                            data-testid={`input-edu-degree-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => {
                              const newEdu = [...cvData.educations];
                              newEdu[index].field = e.target.value;
                              updateField("educations", newEdu);
                            }}
                            data-testid={`input-edu-field-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...cvData.educations];
                              newEdu[index].institution = e.target.value;
                              updateField("educations", newEdu);
                            }}
                            data-testid={`input-edu-institution-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...cvData.educations];
                              newEdu[index].year = e.target.value;
                              updateField("educations", newEdu);
                            }}
                            data-testid={`input-edu-year-${index}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => updateField("educations", [...cvData.educations, { degree: "", institution: "", year: "", field: "" }])}
                  data-testid="button-add-education"
                >
                  + Add Education
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="skills">{t("skills")}</Label>
                  <Textarea
                    id="skills"
                    value={cvData.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    placeholder="JavaScript, React, Node.js, Python..."
                    className="min-h-[80px]"
                    data-testid="textarea-skills"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">{t("language")}</Label>
                  <Textarea
                    id="languages"
                    value={cvData.languages}
                    onChange={(e) => updateField("languages", e.target.value)}
                    placeholder="Arabic (Native), English (Fluent)..."
                    className="min-h-[80px]"
                    data-testid="textarea-languages"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={cvData.certifications}
                    onChange={(e) => updateField("certifications", e.target.value)}
                    className="min-h-[80px]"
                    data-testid="textarea-certifications"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="p-6 border rounded-md bg-card">
                  <div className="text-center mb-6 pb-6 border-b">
                    <h2 className="text-2xl font-bold">{cvData.fullName || "Your Name"}</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-2">
                      {cvData.email && <span>{cvData.email}</span>}
                      {cvData.phone && <span>{cvData.phone}</span>}
                      {cvData.province && <span>{t(cvData.province)}</span>}
                    </div>
                  </div>

                  {cvData.summary && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">{t("description")}</h3>
                      <p className="text-sm">{cvData.summary}</p>
                    </div>
                  )}

                  {cvData.experiences.some(e => e.title) && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">{t("workExperience")}</h3>
                      {cvData.experiences.filter(e => e.title).map((exp, i) => (
                        <div key={i} className="mb-3">
                          <div className="flex justify-between">
                            <span className="font-medium">{exp.title}</span>
                            <span className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate || "Present"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.educations.some(e => e.degree) && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">{t("educationHistory")}</h3>
                      {cvData.educations.filter(e => e.degree).map((edu, i) => (
                        <div key={i} className="mb-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{edu.degree} - {edu.field}</span>
                            <span className="text-sm text-muted-foreground">{edu.year}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {cvData.skills && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">{t("skills")}</h3>
                      <p className="text-sm">{cvData.skills}</p>
                    </div>
                  )}

                  {cvData.languages && (
                    <div>
                      <h3 className="font-semibold mb-2">{t("language")}</h3>
                      <p className="text-sm">{cvData.languages}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button size="lg" data-testid="button-download-cv">
                    <Download className="h-4 w-4 me-2" />
                    {t("download")} PDF
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                data-testid="button-prev"
              >
                {dir === "rtl" ? <ChevronRight className="h-4 w-4 me-1" /> : <ChevronLeft className="h-4 w-4 me-1" />}
                {t("back")}
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep} data-testid="button-next">
                  {t("next")}
                  {dir === "rtl" ? <ChevronLeft className="h-4 w-4 ms-1" /> : <ChevronRight className="h-4 w-4 ms-1" />}
                </Button>
              ) : (
                <Button data-testid="button-submit-cv">
                  {t("submit")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
