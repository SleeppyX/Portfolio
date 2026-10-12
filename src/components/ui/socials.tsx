import type { ComponentType, SVGProps } from "react";
import { profile } from "@/data/profile";
import {
  DiscordIcon,
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from "./icons";

export type SocialLink = {
  id: string;
  label: string;
  /** ชื่อบัญชีที่แสดงข้างชื่อแพลตฟอร์ม */
  handle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
} & (
  | { href: string; copyText?: never }
  /** ไม่มีลิงก์ กดแล้วคัดลอกข้อความแทน (Discord) */
  | { href?: never; copyText: string }
);

/** ส่วนท้ายของ URL เช่น https://github.com/SleeppyX → SleeppyX */
const lastSegment = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;

/** ช่องทางติดต่อทั้งหมดจาก profile.ts เรียงตามลำดับที่แสดง (ไม่ใส่ค่า = ไม่แสดง) */
export function getSocialLinks(): SocialLink[] {
  const { socials, email } = profile;
  const links: (SocialLink | false | undefined | "")[] = [
    socials.github && {
      id: "github",
      label: "GitHub",
      handle: lastSegment(socials.github),
      href: socials.github,
      Icon: GithubIcon,
    },
    socials.linkedin && {
      id: "linkedin",
      label: "LinkedIn",
      handle: lastSegment(socials.linkedin),
      href: socials.linkedin,
      Icon: LinkedinIcon,
    },
    email && {
      id: "email",
      label: "Gmail",
      handle: email,
      href: `mailto:${email}`,
      Icon: MailIcon,
    },
    socials.instagram && {
      id: "instagram",
      label: "Instagram",
      handle: `@${lastSegment(socials.instagram)}`,
      href: socials.instagram,
      Icon: InstagramIcon,
    },
    socials.facebook && {
      id: "facebook",
      label: "Facebook",
      handle: profile.name.en,
      href: socials.facebook,
      Icon: FacebookIcon,
    },
    socials.discord && {
      id: "discord",
      label: "Discord",
      handle: socials.discord,
      copyText: socials.discord,
      Icon: DiscordIcon,
    },
  ];
  return links.filter((link): link is SocialLink => Boolean(link));
}
