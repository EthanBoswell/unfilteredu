export type CategoryData = {
  summary: string;
  key_quotes: string[];
  score: number;
};

export type Summary = {
  housing: CategoryData;
  social_life: CategoryData;
  dining: CategoryData;
  mental_health: CategoryData;
  financial_aid: CategoryData;
  academics: CategoryData;
  administration: CategoryData;
  location_and_campus: CategoryData;
  career_outcomes: CategoryData;
  value_for_money: CategoryData;
  overall_vibe: CategoryData;
  red_flags: CategoryData;
  hidden_gems: CategoryData;
};

export type SchoolMeta = {
  slug: string;
  name: string;
  location: string;
  stats: Array<{ icon: string; label: string }>;
  colors: { primary: string; secondary: string };
  radioStation: string;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

export type RoomPalette = { roomColor: string; wallColor: string; accentColor: string };

export function getRoomPalette(school: SchoolMeta): RoomPalette {
  return {
    roomColor: darken(school.colors.primary, 0.85),
    wallColor: darken(school.colors.primary, 0.92),
    accentColor: school.colors.secondary,
  };
}

export const SCHOOLS: SchoolMeta[] = [
  {
    slug: "unc",
    name: "UNC Chapel Hill",
    location: "Chapel Hill, NC",
    colors: { primary: "#4B9CD3", secondary: "#13294B" },
    radioStation: "WXYC 89.3 FM",
    stats: [
      { icon: "📋", label: "84K+ Applicants" },
      { icon: "🏠", label: "Competitive Housing" },
      { icon: "🐏", label: "Strong School Spirit" },
    ],
  },
  {
    slug: "duke",
    name: "Duke University",
    location: "Durham, NC",
    colors: { primary: "#00539B", secondary: "#012169" },
    radioStation: "WXDU 88.7 FM",
    stats: [
      { icon: "📋", label: "47K+ Applicants" },
      { icon: "💰", label: "Strong Financial Aid" },
      { icon: "🏀", label: "Elite Athletics" },
    ],
  },
  {
    slug: "ncstate",
    name: "NC State",
    location: "Raleigh, NC",
    colors: { primary: "#CC0000", secondary: "#000000" },
    radioStation: "WKNC 88.1 FM",
    stats: [
      { icon: "📋", label: "35K+ Applicants" },
      { icon: "🔬", label: "Strong STEM Programs" },
      { icon: "🐺", label: "Wolfpack Spirit" },
    ],
  },
  {
    slug: "georgiatech",
    name: "Georgia Tech",
    location: "Atlanta, GA",
    colors: { primary: "#B3A369", secondary: "#003057" },
    radioStation: "WREK 91.1 FM",
    stats: [
      { icon: "📋", label: "49K+ Applicants" },
      { icon: "💼", label: "Top Co-op Program" },
      { icon: "🏙️", label: "Atlanta Location" },
    ],
  },
  {
    slug: "uva",
    name: "University of Virginia",
    location: "Charlottesville, VA",
    colors: { primary: "#232D4B", secondary: "#E57200" },
    radioStation: "WTJU 91.1 FM",
    stats: [
      { icon: "📋", label: "57K+ Applicants" },
      { icon: "🏛️", label: "Historic Campus" },
      { icon: "⚖️", label: "Top Honor Code" },
    ],
  },
  {
    slug: "virginiatech",
    name: "Virginia Tech",
    location: "Blacksburg, VA",
    colors: { primary: "#861F41", secondary: "#E5751F" },
    radioStation: "WUVT 90.7 FM",
    stats: [
      { icon: "📋", label: "32K+ Applicants" },
      { icon: "🔧", label: "Top Engineering" },
      { icon: "🦃", label: "Hokie Nation" },
    ],
  },
  {
    slug: "fsu",
    name: "Florida State",
    location: "Tallahassee, FL",
    colors: { primary: "#782F40", secondary: "#CEB888" },
    radioStation: "WVFS 89.7 FM",
    stats: [
      { icon: "📋", label: "55K+ Applicants" },
      { icon: "🏈", label: "ACC Athletics" },
      { icon: "☀️", label: "Florida Weather" },
    ],
  },
  {
    slug: "miami",
    name: "University of Miami",
    location: "Coral Gables, FL",
    colors: { primary: "#005030", secondary: "#F47321" },
    radioStation: "WVUM 90.5 FM",
    stats: [
      { icon: "📋", label: "46K+ Applicants" },
      { icon: "🌴", label: "South Florida Campus" },
      { icon: "🎓", label: "Strong Research" },
    ],
  },
  {
    slug: "clemson",
    name: "Clemson University",
    location: "Clemson, SC",
    colors: { primary: "#F56600", secondary: "#522D80" },
    radioStation: "WSBF 88.1 FM",
    stats: [
      { icon: "📋", label: "41K+ Applicants" },
      { icon: "🐅", label: "Tiger Pride" },
      { icon: "🌳", label: "Beautiful Campus" },
    ],
  },
  {
    slug: "wakeforest",
    name: "Wake Forest",
    location: "Winston-Salem, NC",
    colors: { primary: "#9E7E38", secondary: "#000000" },
    radioStation: "WAKE Radio — online",
    stats: [
      { icon: "📋", label: "16K+ Applicants" },
      { icon: "👥", label: "Small Class Sizes" },
      { icon: "💼", label: "Strong Pre-Professional" },
    ],
  },
  {
    slug: "bc",
    name: "Boston College",
    location: "Chestnut Hill, MA",
    colors: { primary: "#8C2232", secondary: "#B98F33" },
    radioStation: "WZBC 90.3 FM",
    stats: [
      { icon: "📋", label: "37K+ Applicants" },
      { icon: "🏔️", label: "Scenic Campus" },
      { icon: "🦅", label: "Eagle Pride" },
    ],
  },
  {
    slug: "syracuse",
    name: "Syracuse University",
    location: "Syracuse, NY",
    colors: { primary: "#D44500", secondary: "#002D72" },
    radioStation: "WERW — online radio",
    stats: [
      { icon: "📋", label: "27K+ Applicants" },
      { icon: "📺", label: "Top Communications" },
      { icon: "🍊", label: "Orange Nation" },
    ],
  },
  {
    slug: "pitt",
    name: "University of Pittsburgh",
    location: "Pittsburgh, PA",
    colors: { primary: "#003594", secondary: "#FFB81C" },
    radioStation: "WPTS 92.1 FM",
    stats: [
      { icon: "📋", label: "34K+ Applicants" },
      { icon: "🏥", label: "Top Medical Programs" },
      { icon: "🌆", label: "City Campus" },
    ],
  },
  {
    slug: "louisville",
    name: "University of Louisville",
    location: "Louisville, KY",
    colors: { primary: "#AD0000", secondary: "#000000" },
    radioStation: "WLCV — online radio",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "🏥", label: "Strong Health Sciences" },
      { icon: "🃏", label: "Cardinal Pride" },
    ],
  },
  {
    slug: "notredame",
    name: "Notre Dame",
    location: "South Bend, IN",
    colors: { primary: "#0C2340", secondary: "#C99700" },
    radioStation: "WVFI — online radio",
    stats: [
      { icon: "📋", label: "26K+ Applicants" },
      { icon: "🏈", label: "Historic Football" },
      { icon: "⛪", label: "Strong Community" },
    ],
  },
  {
    slug: "ucberkeley",
    name: "UC Berkeley",
    location: "Berkeley, CA",
    colors: { primary: "#003262", secondary: "#FDB515" },
    radioStation: "KALX 90.7 FM",
    stats: [
      { icon: "📋", label: "128K+ Applicants" },
      { icon: "🔬", label: "#1 Public University" },
      { icon: "🌉", label: "Bay Area Location" },
    ],
  },
  {
    slug: "smu",
    name: "Southern Methodist University",
    location: "Dallas, TX",
    colors: { primary: "#C8102E", secondary: "#354CA1" },
    radioStation: "Mustang Radio — online",
    stats: [
      { icon: "📋", label: "17K+ Applicants" },
      { icon: "🏙️", label: "Dallas Location" },
      { icon: "💼", label: "Strong Business School" },
    ],
  },
  {
    slug: "stanford",
    name: "Stanford University",
    location: "Palo Alto, CA",
    colors: { primary: "#8C1515", secondary: "#4D4F53" },
    radioStation: "KZSU 90.1 FM",
    stats: [
      { icon: "📋", label: "57K+ Applicants" },
      { icon: "💡", label: "Silicon Valley Access" },
      { icon: "🌲", label: "Beautiful Campus" },
    ],
  },
  {
    slug: "howard",
    name: "Howard University",
    location: "Washington, DC",
    colors: { primary: "#003a63", secondary: "#8B0000" },
    radioStation: "WHUR 96.3 FM — Howard's own station",
    stats: [
      { icon: "📋", label: "30K+ Applicants" },
      { icon: "🏛️", label: "Top HBCU" },
      { icon: "🏙️", label: "DC Location" },
    ],
  },
  {
    slug: "alabama",
    name: "University of Alabama",
    location: "Tuscaloosa, AL",
    colors: { primary: "#9E1B32", secondary: "#828A8F" },
    radioStation: "WVUA-FM 90.7",
    stats: [
      { icon: "📋", label: "53K+ Applicants" },
      { icon: "🏈", label: "SEC Football" },
      { icon: "🎓", label: "Honors College" },
    ],
  },
  {
    slug: "auburn",
    name: "Auburn University",
    location: "Auburn, AL",
    colors: { primary: "#DD550C", secondary: "#03244D" },
    radioStation: "WEGL 91.1 FM",
    stats: [
      { icon: "📋", label: "28K+ Applicants" },
      { icon: "🦅", label: "War Eagle Spirit" },
      { icon: "🌳", label: "Beautiful Campus" },
    ],
  },
  {
    slug: "florida",
    name: "University of Florida",
    location: "Gainesville, FL",
    colors: { primary: "#0021A5", secondary: "#FA4616" },
    radioStation: "WRUF 95.3 FM",
    stats: [
      { icon: "📋", label: "75K+ Applicants" },
      { icon: "🐊", label: "SEC Athletics" },
      { icon: "🔬", label: "Top Research University" },
    ],
  },
  {
    slug: "uga",
    name: "University of Georgia",
    location: "Athens, GA",
    colors: { primary: "#BA0C2F", secondary: "#000000" },
    radioStation: "WUOG 90.5 FM",
    stats: [
      { icon: "📋", label: "40K+ Applicants" },
      { icon: "🏆", label: "SEC Champions" },
      { icon: "🌳", label: "Classic Campus" },
    ],
  },
  {
    slug: "tennessee",
    name: "University of Tennessee",
    location: "Knoxville, TN",
    colors: { primary: "#FF8200", secondary: "#58595B" },
    radioStation: "WUTK 90.3 FM \"The Rock\"",
    stats: [
      { icon: "📋", label: "34K+ Applicants" },
      { icon: "🟠", label: "Vol Nation" },
      { icon: "🏈", label: "SEC Athletics" },
    ],
  },
  {
    slug: "kentucky",
    name: "University of Kentucky",
    location: "Lexington, KY",
    colors: { primary: "#0033A0", secondary: "#FFFFFF" },
    radioStation: "WRFL 88.1 FM",
    stats: [
      { icon: "📋", label: "23K+ Applicants" },
      { icon: "🏀", label: "Blue Bloods Basketball" },
      { icon: "🐴", label: "Horse Country" },
    ],
  },
  {
    slug: "southcarolina",
    name: "University of South Carolina",
    location: "Columbia, SC",
    colors: { primary: "#73000A", secondary: "#000000" },
    radioStation: "WUSC 90.5 FM",
    stats: [
      { icon: "📋", label: "40K+ Applicants" },
      { icon: "🐓", label: "Gamecock Pride" },
      { icon: "🏈", label: "SEC Athletics" },
    ],
  },
  {
    slug: "usc",
    name: "University of Southern California",
    location: "Los Angeles, CA",
    colors: { primary: "#990000", secondary: "#FFCC00" },
    radioStation: "KXSC",
    stats: [
      { icon: "📋", label: "80K+ Applicants" },
      { icon: "🎬", label: "Hollywood Access" },
      { icon: "🐎", label: "Trojan Family" },
    ],
  },
];

export function getSchoolBySlug(slug: string): SchoolMeta | undefined {
  return SCHOOLS.find((s) => s.slug === slug);
}
