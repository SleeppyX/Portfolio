import { getLocale, getTranslations } from "next-intl/server";
import { ButtonAnchor } from "@/components/ui/Button";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function Contact() {
  const t = await getTranslations("Contact");
  const tHero = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <Section id="contact" title={t("title")}>
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="mx-auto max-w-xl text-lg text-muted">{t("description")}</p>
        <p className="mt-2 text-sm text-muted">{localize(profile.location, locale)}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonAnchor href={`mailto:${profile.email}`}>
            <MailIcon />
            {t("email")}
          </ButtonAnchor>
          <ButtonAnchor variant="outline" href={localize(profile.resume, locale)} download>
            <DownloadIcon />
            {tHero("downloadResume")}
          </ButtonAnchor>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-muted">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-accent"
          >
            <GithubIcon width={22} height={22} />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-accent"
          >
            <LinkedinIcon width={22} height={22} />
          </a>
        </div>
      </div>
    </Section>
  );
}
