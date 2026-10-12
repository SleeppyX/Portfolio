/**
 * พื้นหลังหน้า Bio
 * - โหมดมืด: ท้องฟ้ากลางคืน มีดาวกะพริบ แสง aurora และดาวตกนานๆ ครั้ง
 * - โหมดสว่าง: ไล่สีฟ้าอ่อนแบบท้องฟ้ากลางวัน
 * style ของ animation อยู่ใน globals.css (.sky-*)
 */

const STAR_COUNT = 110;

/** สุ่มแบบกำหนด seed ได้ ให้ตำแหน่งดาวเหมือนเดิมทุกครั้ง (server กับ browser ตรงกัน) */
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const random = seededRandom(20261012);
const stars = Array.from({ length: STAR_COUNT }, () => ({
  left: random() * 100,
  top: random() * 100,
  size: random() < 0.85 ? 1 + random() : 2 + random(),
  delay: random() * 6,
  duration: 3 + random() * 4,
}));

/** ดาวตก 3 ดวง รอบเวลาไม่เท่ากัน เลยดูเหมือนสุ่ม (ทุกๆ 6–10 วินาทีจะมีสักดวง) */
const meteors = [
  { top: 8, left: 70, delay: 2, duration: 9 },
  { top: 22, left: 40, delay: 6, duration: 13 },
  { top: 4, left: 90, delay: 11, duration: 17 },
];

export function NightSky() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* โหมดสว่าง: ท้องฟ้ากลางวัน */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#cfe8ff] via-[#eef6ff] to-background dark:hidden" />

      {/* โหมดมืด: ท้องฟ้ากลางคืน */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="sky-aurora absolute inset-x-0 -top-1/4 h-3/4" />
        {stars.map((star, index) => (
          <span
            key={index}
            className="sky-star absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
        {meteors.map((meteor, index) => (
          <span
            key={index}
            className="sky-meteor absolute"
            style={{
              top: `${meteor.top}%`,
              left: `${meteor.left}%`,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
