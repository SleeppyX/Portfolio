import { getLocale, getTranslations } from "next-intl/server";
import { ButtonAnchor } from "@/components/ui/Button";
import { CopyButton } from "@/components/bio/CopyButton";
import { DownloadIcon, MailIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { getSocialLinks } from "@/components/ui/socials";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function Contact() {
  const t = await getTranslations("Contact");
  const tHero = await getTranslations("Hero");
  const tBio = await getTranslations("Bio");
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
          {profile.resume && (
            <ButtonAnchor variant="outline" href={localize(profile.resume, locale)} download>
              <DownloadIcon />
              {tHero("downloadResume")}
            </ButtonAnchor>
          )}
        </div>

        {/* ไอคอนทุกช่องทาง (ยกเว้นอีเมลที่มีปุ่มด้านบนแล้ว) ข้อมูลชุดเดียวกับหน้า Bio */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-muted">
          {getSocialLinks()
            .filter((link) => link.id !== "email")
            .map(({ id, label, handle, href, copyText, Icon }) =>
              copyText ? (
                <CopyButton
                  key={id}
                  text={copyText}
                  copiedLabel={tBio("copied")}
                  title={`${label}: ${handle} (${tBio("copy")})`}
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Icon width={22} height={22} aria-label={label} />
                </CopyButton>
              ) : (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="hover:text-accent"
                >
                  <Icon width={22} height={22} />
                </a>
              ),
            )}
        </div>
      </div>
    </Section>
  );
}
