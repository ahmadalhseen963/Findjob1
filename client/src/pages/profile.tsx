import { useState } from "react";
import { User, Mail, Phone, MapPin, Building2, FileText, Briefcase, Settings, Edit, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { useAppStore } from "@/lib/store";
import { syrianProvinces } from "@shared/schema";
import { Link } from "wouter";

export default function Profile() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "أحمد محمد",
    email: user?.email || "ahmed@example.com",
    phone: user?.phone || "+963 999 123 456",
    province: user?.province || "damascus",
    bio: user?.bio || "مهندس برمجيات ذو خبرة 5 سنوات في تطوير تطبيقات الويب والموبايل",
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-4">{t("login")}</h1>
        <p className="text-muted-foreground mb-6">Please login to view your profile</p>
        <Link href="/login">
          <Button data-testid="button-go-login">{t("login")}</Button>
        </Link>
      </div>
    );
  }

  const mockApplications = [
    { id: "1", title: "مهندس برمجيات", company: "شركة التقنية", status: "pending", date: "2024-01-15" },
    { id: "2", title: "مدير مشروع", company: "مجموعة الأعمال", status: "reviewed", date: "2024-01-10" },
    { id: "3", title: "محلل بيانات", company: "البنك العربي", status: "rejected", date: "2024-01-05" },
  ];

  const mockSavedJobs = [
    { id: "1", title: "مطور واجهات", company: "شركة البرمجة", province: "damascus" },
    { id: "2", title: "مهندس شبكات", company: "اتصالات سوريا", province: "aleppo" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    reviewed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    shortlisted: "bg-green-500/10 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    accepted: "bg-primary/10 text-primary",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="text-2xl">{profileData.fullName[0]}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 end-0 h-8 w-8 rounded-full" data-testid="button-change-avatar">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <h2 className="text-xl font-bold mb-1" data-testid="text-profile-name">{profileData.fullName}</h2>
              <p className="text-muted-foreground mb-4">{t("individual")}</p>

              <div className="space-y-2 text-sm text-start">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{t(profileData.province)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Link href="/cv-builder">
                  <Button variant="outline" className="w-full" data-testid="button-build-cv">
                    <FileText className="h-4 w-4 me-2" />
                    {t("buildCV")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info" data-testid="tab-info">
                <User className="h-4 w-4 me-2" />
                {t("personalInfo")}
              </TabsTrigger>
              <TabsTrigger value="applications" data-testid="tab-applications">
                <Briefcase className="h-4 w-4 me-2" />
                {t("totalApplications")}
              </TabsTrigger>
              <TabsTrigger value="saved" data-testid="tab-saved">
                <FileText className="h-4 w-4 me-2" />
                {t("saved")}
              </TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">
                <Settings className="h-4 w-4 me-2" />
                {t("settings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>{t("personalInfo")}</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    data-testid="button-edit-profile"
                  >
                    {isEditing ? <Save className="h-4 w-4 me-2" /> : <Edit className="h-4 w-4 me-2" />}
                    {isEditing ? t("submit") : t("edit")}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("fullName")}</Label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        disabled={!isEditing}
                        data-testid="input-fullname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("email")}</Label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("phone")}</Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        data-testid="input-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("location")}</Label>
                      <Select
                        value={profileData.province}
                        onValueChange={(v) => setProfileData({ ...profileData, province: v })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger data-testid="select-province">
                          <SelectValue />
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
                    <Label>{t("description")}</Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      className="min-h-[100px]"
                      data-testid="textarea-bio"
                    />
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
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-md" data-testid={`application-${app.id}`}>
                        <div>
                          <h4 className="font-medium">{app.title}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                        </div>
                        <Badge className={statusColors[app.status]}>
                          {t(app.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>{t("saved")} {t("jobs")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSavedJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-md" data-testid={`saved-job-${job.id}`}>
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                          <Badge variant="outline" className="mt-2">
                            <MapPin className="h-3 w-3 me-1" />
                            {t(job.province)}
                          </Badge>
                        </div>
                        <Link href={`/opportunities/${job.id}`}>
                          <Button size="sm" data-testid={`button-view-${job.id}`}>
                            {t("view")}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t("password")}</Label>
                    <div className="flex gap-4">
                      <Input type="password" placeholder="********" disabled data-testid="input-password" />
                      <Button variant="outline" data-testid="button-change-password">
                        {t("edit")}
                      </Button>
                    </div>
                  </div>
                  <div className="pt-6 border-t">
                    <Button variant="destructive" data-testid="button-delete-account">
                      {t("delete")} Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
