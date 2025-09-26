import { Solar } from 'lunar-javascript';

const ELEMENT_MAP: Record<string, string> = {
  "甲": "Wood", "乙": "Wood",
  "丙": "Fire", "丁": "Fire",
  "戊": "Earth", "己": "Earth",
  "庚": "Metal", "辛": "Metal",
  "壬": "Water", "癸": "Water"
};

const BRANCH_ELEMENT_MAP: Record<string, string> = {
  "子": "Water", "丑": "Earth", "寅": "Wood", "卯": "Wood",
  "辰": "Earth", "巳": "Fire", "午": "Fire", "未": "Earth",
  "申": "Metal", "酉": "Metal", "戌": "Earth", "亥": "Water"
};

export const ELEMENT_ICONS: Record<string, string> = {
  "Wood": "🌳",
  "Fire": "🔥",
  "Earth": "🪨",
  "Metal": "⚔️",
  "Water": "💧",
};
const MATCH_MAP: Record<string, { best: string; good: string; conflict: string }> = {
  "Wood":    { best: "Water", good: "Fire", conflict: "Metal" },
  "Fire":    { best: "Wood",  good: "Earth", conflict: "Water" },
  "Earth":   { best: "Fire",  good: "Metal", conflict: "Wood" },
  "Metal":   { best: "Earth", good: "Water", conflict: "Fire" },
  "Water":   { best: "Metal", good: "Wood",  conflict: "Earth" },
};

export function getPerfectMatch(dominant: string) {
  return MATCH_MAP[dominant];
}


export function getBazi(year: number, month: number, day: number, hour: number) {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const eightChar: any = lunar.getEightChar();

  const yearGz = eightChar.getYear();
  const monthGz = eightChar.getMonth();
  const dayGz = eightChar.getDay();
  const hourGz = eightChar.getTime();

  const zodiac = lunar.getYearShengXiao();
  const monthBranch = eightChar.getMonthZhi();

  const SEASONS: Record<string, string> = {
    "寅": "Spring", "卯": "Spring", "辰": "Spring",
    "巳": "Summer", "午": "Summer", "未": "Summer",
    "申": "Autumn", "酉": "Autumn", "戌": "Autumn",
    "亥": "Winter", "子": "Winter", "丑": "Winter"
  };
  const season = SEASONS[monthBranch] ?? "Unknown";

  // Build pillars
  const pillars = [yearGz, monthGz, dayGz, hourGz].map(p => {
    const stem = p[0];
    const branch = p[1];
    const stemElement = ELEMENT_MAP[stem];
    const branchElement = BRANCH_ELEMENT_MAP[branch];
    return {
      pillar: p,
      stem,
      branch,
      stemElement,
      branchElement,
      stemIcon: ELEMENT_ICONS[stemElement],
      branchIcon: ELEMENT_ICONS[branchElement],
    };
  });

  // Count all elements (stems + branches)
  const allElements = pillars.flatMap(p => [p.stemElement, p.branchElement]);

  const counts: Record<string, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0
  };

  allElements.forEach(e => {
    counts[e] += 1;
  });

  // Find max
  let dominant = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );

  // Tie-breaking with month branch element
  const maxCount = counts[dominant];
  const tied = Object.keys(counts).filter(k => counts[k] === maxCount);

  if (tied.length > 1) {
    const monthBranchElem = BRANCH_ELEMENT_MAP[monthBranch];
    if (tied.includes(monthBranchElem)) {
      dominant = monthBranchElem;
    }
  }

  return {
    bazi: { year: yearGz, month: monthGz, day: dayGz, hour: hourGz },
    zodiac,
    season,
    dominant_element: dominant,
    dominant_icon: ELEMENT_ICONS[dominant],
    pillars,
    counts,
  };
}


