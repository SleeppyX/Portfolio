import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CopyButton } from "@/components/bio/CopyButton";
import { NightSky } from "@/components/bio/NightSky";
import { SpotifyCard } from "@/components/bio/SpotifyCard";
import { CopyIcon, StarIcon } from "@/components/ui/icons";
import { getSocialLinks } from "@/components/ui/socials";
import { experience } from "@/data/experience";
import { profile } from "@/data/profile";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localize } from "@/lib/localize";

/** สไตล์ปุ่มยาวแบบ Linktree (ใช้ทั้งลิงก์และปุ่มคัดลอก) */
const linkClass =
  "bio-rise flex w-full items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_8px_24px_-10px_var(--accent)] focus-visible:border-accent focus-visible:outline-none";

/** ปุ่มค่อยๆ โผล่ทีละปุ่ม ห่างกันปุ่มละ 70ms */
const delay = (index: number) => ({ animationDelay: `${150 + index * 70}ms` });

/** หน้าแรก: Bio แบบ Linktree มีรูป ชื่อ สถานะ และปุ่มไปทุกช่องทาง */
export default async function BioPage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Bio");
  const socials = getSocialLinks();
  // งานปัจจุบัน = งานที่ยังไม่มีวันจบ ใน experience.ts
  const currentJob = experience.find((item) => item.type === "work" && !item.end);

  return (
    <>
      <NightSky />
      <div className="mx-auto flex max-w-md flex-col items-center py-12 sm:py-16">
        <div className="relative">
          {/* แสงฟ้าจางๆ ด้านหลังรูป */}
          <div aria-hidden className="absolute -inset-6 rounded-full bg-accent/40 blur-3xl" />
          <Image
            src={profile.avatar}
            alt={localize(profile.name, locale)}
            width={160}
            height={160}
            priority
            className="relative size-32 rounded-full border-4 border-accent-soft object-cover sm:size-36"
          />
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight">
          {localize(profile.name, locale)}
        </h1>
        <p className="mt-1 text-center text-accent">{localize(profile.role, locale)}</p>

        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {localize(profile.status, locale)}
        </p>

        <p className="mt-6 text-center text-muted">{localize(profile.tagline, locale)}</p>

        {currentJob && (
          <div className="mt-6 w-full rounded-xl border border-border bg-card/70 px-5 py-4 backdrop-blur">
            <p className="text-xs font-medium tracking-wider text-accent uppercase">
              {t("currently")}
            </p>
            <p className="mt-1 font-semibold">{localize(currentJob.title, locale)}</p>
            <p className="text-sm text-muted">{localize(currentJob.organization, locale)}</p>
          </div>
        )}

        {profile.spotify && (
          <SpotifyCard url={profile.spotify} label={t("nowPlaying")} playLabel={t("playVibe")} />
        )}

        <ul className="mt-8 w-full space-y-3">
          <li>
            <Link href="/portfolio" className={`${linkClass} border-accent/60`} style={delay(0)}>
              <StarIcon className="shrink-0 text-accent" />
              <span className="flex-1">
                <span className="block font-semibold">{t("portfolio")}</span>
                <span className="block text-sm text-muted">{t("portfolioHint")}</span>
              </span>
              <span aria-hidden className="text-accent">
                →
              </span>
            </Link>
          </li>

          {socials.map((link, index) => {
            const { id, label, handle, Icon } = link;
            const content = (
              <>
                <Icon className="shrink-0 text-accent" />
                <span className="font-semibold">{label}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-muted">{handle}</span>
              </>
            );
            return (
              <li key={id}>
                {link.copyText !== undefined ? (
                  <CopyButton
                    text={link.copyText}
                    copiedLabel={t("copied")}
                    title={t("copy")}
                    className={linkClass}
                    style={delay(index + 1)}
                  >
                    {content}
                    <CopyIcon className="shrink-0 text-muted" />
                  </CopyButton>
                ) : (
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className={linkClass}
                    style={delay(index + 1)}
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
