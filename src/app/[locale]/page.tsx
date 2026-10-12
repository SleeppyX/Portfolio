import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import type { Locale } from "@/i18n/routing";

/** หน้าแรก: สลับลำดับหรือลบส่วนไหนก็แก้รายการด้านล่างได้เลย */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <FeaturedProjects />
      <Contact />
    </>
  );
}
