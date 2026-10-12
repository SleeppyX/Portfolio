import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";
import { profile } from "@/data/profile";
import { localize } from "@/lib/localize";

export async function Hero() {
  const t = await getTranslations("Hero");
  const locale = await getLocale();

  return (
    <section className="flex flex-col-reverse items-center gap-10 py-16 sm:py-24 md:flex-row md:justify-between">
      <div className="max-w-xl text-center md:text-left">
        <p className="text-muted">{t("greeting")}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {localize(profile.name, locale)}
        </h1>
        <p className="mt-3 text-xl font-medium text-accent">{localize(profile.role, locale)}</p>
        <p className="mt-4 text-lg text-muted">{localize(profile.tagline, locale)}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <ButtonLink href={{ pathname: "/", hash: "projects" }}>{t("viewProjects")}</ButtonLink>
          {profile.resume && (
            <ButtonAnchor variant="outline" href={localize(profile.resume, locale)} download>
              <DownloadIcon />
              {t("downloadResume")}
            </ButtonAnchor>
          )}
        </div>
      </div>

      <Image
        src={profile.avatar}
        alt={localize(profile.name, locale)}
        width={224}
        height={224}
        priority
        className="size-40 rounded-full border-4 border-accent-soft object-cover sm:size-56"
      />
    </section>
  );
}
