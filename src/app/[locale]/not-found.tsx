import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-col items-center py-32 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t("title")}</h1>
      <ButtonLink href="/" className="mt-8">
        {t("back")}
      </ButtonLink>
    </div>
  );
}
