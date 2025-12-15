import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import logoImage from "@assets/5983299235203893086_120_1765260787386.jpg";

export function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src={logoImage} alt="Find Job Syria" className="h-12 w-12 rounded-md object-cover" />
              <div>
                <span className="font-bold text-lg text-primary">{t("siteName")}</span>
                <p className="text-sm text-muted-foreground">{t("siteSlogan")}</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("heroSubtitle")}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-md bg-muted hover-elevate"
                  aria-label={social.label}
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.about")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("provinces")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/provinces/damascus" className="text-muted-foreground hover:text-foreground">
                  {t("damascus")}
                </Link>
              </li>
              <li>
                <Link href="/provinces/aleppo" className="text-muted-foreground hover:text-foreground">
                  {t("aleppo")}
                </Link>
              </li>
              <li>
                <Link href="/provinces/homs" className="text-muted-foreground hover:text-foreground">
                  {t("homs")}
                </Link>
              </li>
              <li>
                <Link href="/provinces/latakia" className="text-muted-foreground hover:text-foreground">
                  {t("latakia")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@findjobsyria.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+963 11 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t("damascus")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {t("siteName")}. {t("footer.copyright")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
