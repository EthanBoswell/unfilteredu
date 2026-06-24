export type CategoryData = {
  key_points: string[];
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

export function getContrastTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum > 0.35 ? "#111" : "#fff";
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
    slug: "lsu",
    name: "Louisiana State University",
    location: "Baton Rouge, LA",
    colors: { primary: "#461D7C", secondary: "#FDD023" },
    radioStation: "KLSU 91.1 FM",
    stats: [
      { icon: "📋", label: "34K+ Applicants" },
      { icon: "🏈", label: "SEC Football" },
      { icon: "🐅", label: "Tiger Country" },
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
  // SEC
  {
    slug: "olemiss",
    name: "Ole Miss",
    location: "Oxford, MS",
    colors: { primary: "#002147", secondary: "#CE1126" },
    radioStation: "Rebel Radio — online",
    stats: [
      { icon: "📋", label: "24K+ Applicants" },
      { icon: "⛺", label: "The Grove Tailgating" },
      { icon: "🏈", label: "SEC Athletics" },
    ],
  },
  {
    slug: "msstate",
    name: "Mississippi State",
    location: "Starkville, MS",
    colors: { primary: "#660000", secondary: "#FFFFFF" },
    radioStation: "WMSV 91.1 FM",
    stats: [
      { icon: "📋", label: "18K+ Applicants" },
      { icon: "🐄", label: "Top Ag Programs" },
      { icon: "🐶", label: "Bulldog Spirit" },
    ],
  },
  {
    slug: "arkansas",
    name: "University of Arkansas",
    location: "Fayetteville, AR",
    colors: { primary: "#9D2235", secondary: "#000000" },
    radioStation: "KXUA 88.3 FM",
    stats: [
      { icon: "📋", label: "30K+ Applicants" },
      { icon: "🐗", label: "Razorback Spirit" },
      { icon: "⛰️", label: "Ozark Scenery" },
    ],
  },
  {
    slug: "tamu",
    name: "Texas A&M",
    location: "College Station, TX",
    colors: { primary: "#500000", secondary: "#FFFFFF" },
    radioStation: "KANM — online",
    stats: [
      { icon: "📋", label: "47K+ Applicants" },
      { icon: "🎖️", label: "Corps of Cadets Tradition" },
      { icon: "🤝", label: "Strong Aggie Network" },
    ],
  },
  {
    slug: "texas",
    name: "University of Texas",
    location: "Austin, TX",
    colors: { primary: "#BF5700", secondary: "#FFFFFF" },
    radioStation: "KVRX 91.7 FM",
    stats: [
      { icon: "📋", label: "66K+ Applicants" },
      { icon: "💻", label: "Austin Tech Hub" },
      { icon: "🤘", label: "Longhorn Pride" },
    ],
  },
  {
    slug: "vanderbilt",
    name: "Vanderbilt University",
    location: "Nashville, TN",
    colors: { primary: "#000000", secondary: "#866D4B" },
    radioStation: "WRVU — online",
    stats: [
      { icon: "📋", label: "46K+ Applicants" },
      { icon: "🎓", label: "Elite Academics" },
      { icon: "🎸", label: "Music City Location" },
    ],
  },
  {
    slug: "missouri",
    name: "Missouri University",
    location: "Columbia, MO",
    colors: { primary: "#F1B82D", secondary: "#000000" },
    radioStation: "KCOU 88.1 FM",
    stats: [
      { icon: "📋", label: "28K+ Applicants" },
      { icon: "📰", label: "Top Journalism School" },
      { icon: "🐯", label: "Mizzou Spirit" },
    ],
  },
  {
    slug: "oklahoma",
    name: "Oklahoma University",
    location: "Norman, OK",
    colors: { primary: "#841617", secondary: "#FDF9D8" },
    radioStation: "KGOU 106.3 FM",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "🏈", label: "SEC Football" },
      { icon: "🔴", label: "Sooner Spirit" },
    ],
  },
  // Big 12
  {
    slug: "kansas",
    name: "Kansas",
    location: "Lawrence, KS",
    colors: { primary: "#0051BA", secondary: "#E8000D" },
    radioStation: "KJHK 90.7 FM",
    stats: [
      { icon: "📋", label: "17K+ Applicants" },
      { icon: "🏀", label: "Blue Bloods Basketball" },
      { icon: "🏙️", label: "Classic College Town" },
    ],
  },
  {
    slug: "kstate",
    name: "Kansas State",
    location: "Manhattan, KS",
    colors: { primary: "#512888", secondary: "#FFFFFF" },
    radioStation: "KSDB 91.9 FM \"Wildcat 91.9\"",
    stats: [
      { icon: "📋", label: "12K+ Applicants" },
      { icon: "🐱", label: "Wildcat Pride" },
      { icon: "🐄", label: "Strong Ag & Vet Programs" },
    ],
  },
  {
    slug: "iowastate",
    name: "Iowa State",
    location: "Ames, IA",
    colors: { primary: "#C8102E", secondary: "#F1BE48" },
    radioStation: "KURE 88.5 FM",
    stats: [
      { icon: "📋", label: "21K+ Applicants" },
      { icon: "🔧", label: "Strong Engineering" },
      { icon: "🌪️", label: "Cyclone Spirit" },
    ],
  },
  {
    slug: "baylor",
    name: "Baylor University",
    location: "Waco, TX",
    colors: { primary: "#154734", secondary: "#FFB81C" },
    radioStation: "Baylor Line Radio — online",
    stats: [
      { icon: "📋", label: "48K+ Applicants" },
      { icon: "✝️", label: "Strong Faith Community" },
      { icon: "🐻", label: "Big 12 Athletics" },
    ],
  },
  {
    slug: "tcu",
    name: "TCU",
    location: "Fort Worth, TX",
    colors: { primary: "#4D1979", secondary: "#FFFFFF" },
    radioStation: "KTCU 88.7 FM \"The Choice\"",
    stats: [
      { icon: "📋", label: "24K+ Applicants" },
      { icon: "🐸", label: "Horned Frog Pride" },
      { icon: "🎓", label: "Strong Greek Life" },
    ],
  },
  {
    slug: "wvu",
    name: "West Virginia University",
    location: "Morgantown, WV",
    colors: { primary: "#002855", secondary: "#EAAA00" },
    radioStation: "U92 (WWVU) 91.7 FM",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "⛰️", label: "Mountaineer Spirit" },
      { icon: "🎉", label: "Legendary Tailgates" },
    ],
  },
  {
    slug: "cincinnati",
    name: "University of Cincinnati",
    location: "Cincinnati, OH",
    colors: { primary: "#E00122", secondary: "#000000" },
    radioStation: "Bearcat Radio — online",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "💼", label: "Top Co-op Program" },
      { icon: "🌆", label: "Urban Campus" },
    ],
  },
  {
    slug: "houston",
    name: "University of Houston",
    location: "Houston, TX",
    colors: { primary: "#C8102E", secondary: "#FFFFFF" },
    radioStation: "Coog Radio — online",
    stats: [
      { icon: "📋", label: "30K+ Applicants" },
      { icon: "⚡", label: "Energy Corridor Access" },
      { icon: "🌎", label: "Highly Diverse Campus" },
    ],
  },
  {
    slug: "ucf",
    name: "UCF",
    location: "Orlando, FL",
    colors: { primary: "#000000", secondary: "#FFC904" },
    radioStation: "Knight Radio — online",
    stats: [
      { icon: "📋", label: "45K+ Applicants" },
      { icon: "🎢", label: "Orlando Location" },
      { icon: "🐝", label: "One of the Largest Campuses" },
    ],
  },
  {
    slug: "byu",
    name: "BYU",
    location: "Provo, UT",
    colors: { primary: "#002E5D", secondary: "#FFFFFF" },
    radioStation: "BYU Radio — SiriusXM & online",
    stats: [
      { icon: "📋", label: "15K+ Applicants" },
      { icon: "📜", label: "Strong Honor Code Culture" },
      { icon: "⛰️", label: "Mountain Scenery" },
    ],
  },
  {
    slug: "utah",
    name: "University of Utah",
    location: "Salt Lake City, UT",
    colors: { primary: "#CC0000", secondary: "#FFFFFF" },
    radioStation: "Radio U — online",
    stats: [
      { icon: "📋", label: "20K+ Applicants" },
      { icon: "🎿", label: "Ski Resort Access" },
      { icon: "🔬", label: "Strong Research University" },
    ],
  },
  {
    slug: "colorado",
    name: "University of Colorado",
    location: "Boulder, CO",
    colors: { primary: "#000000", secondary: "#CFB87C" },
    radioStation: "KVCU \"Radio 1190\" AM",
    stats: [
      { icon: "📋", label: "58K+ Applicants" },
      { icon: "🏔️", label: "Outdoor Lifestyle" },
      { icon: "🔬", label: "Strong Research Funding" },
    ],
  },
  {
    slug: "arizona",
    name: "University of Arizona",
    location: "Tucson, AZ",
    colors: { primary: "#AB0520", secondary: "#0C234B" },
    radioStation: "KAMP Student Radio — online",
    stats: [
      { icon: "📋", label: "45K+ Applicants" },
      { icon: "🌵", label: "Desert Campus" },
      { icon: "🔭", label: "Top Astronomy Program" },
    ],
  },
  {
    slug: "asu",
    name: "Arizona State",
    location: "Tempe, AZ",
    colors: { primary: "#8C1D40", secondary: "#FFC627" },
    radioStation: "Blaze Radio — online",
    stats: [
      { icon: "📋", label: "70K+ Applicants" },
      { icon: "🚀", label: "Innovation-Focused" },
      { icon: "🔥", label: "Largest US Enrollment" },
    ],
  },
  {
    slug: "okstate",
    name: "Oklahoma State",
    location: "Stillwater, OK",
    colors: { primary: "#FF7300", secondary: "#000000" },
    radioStation: "Pistol Pete Radio — online",
    stats: [
      { icon: "📋", label: "19K+ Applicants" },
      { icon: "🤠", label: "Cowboy Spirit" },
      { icon: "🐄", label: "Strong Ag Programs" },
    ],
  },
  {
    slug: "texastech",
    name: "Texas Tech University",
    location: "Lubbock, TX",
    colors: { primary: "#CC0000", secondary: "#000000" },
    radioStation: "KTXT 88.1 FM \"The Raider\"",
    stats: [
      { icon: "📋", label: "28K+ Applicants" },
      { icon: "🔴", label: "Red Raider Spirit" },
      { icon: "🤠", label: "West Texas Campus" },
    ],
  },
  // Big Ten
  {
    slug: "michigan",
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    colors: { primary: "#00274C", secondary: "#FFCB05" },
    radioStation: "WCBN 88.3 FM",
    stats: [
      { icon: "📋", label: "87K+ Applicants" },
      { icon: "🏆", label: "Top Public University" },
      { icon: "🐺", label: "Wolverine Pride" },
    ],
  },
  {
    slug: "michiganstate",
    name: "Michigan State",
    location: "East Lansing, MI",
    colors: { primary: "#18453B", secondary: "#FFFFFF" },
    radioStation: "Impact 89FM (WDBM) 88.9",
    stats: [
      { icon: "📋", label: "38K+ Applicants" },
      { icon: "🌾", label: "Big Ag Research" },
      { icon: "🟢", label: "Spartan Spirit" },
    ],
  },
  {
    slug: "ohiostate",
    name: "Ohio State",
    location: "Columbus, OH",
    colors: { primary: "#BB0000", secondary: "#666666" },
    radioStation: "88.7 The Beat — online",
    stats: [
      { icon: "📋", label: "85K+ Applicants" },
      { icon: "🏈", label: "Massive Buckeye Fan Base" },
      { icon: "🏙️", label: "Huge Urban Campus" },
    ],
  },
  {
    slug: "pennstate",
    name: "Penn State",
    location: "State College, PA",
    colors: { primary: "#041E42", secondary: "#FFFFFF" },
    radioStation: "LION 90.7 FM (WKPS)",
    stats: [
      { icon: "📋", label: "90K+ Applicants" },
      { icon: "💙", label: "THON Philanthropy Culture" },
      { icon: "🏈", label: "Legendary Tailgates" },
    ],
  },
  {
    slug: "wisconsin",
    name: "University of Wisconsin",
    location: "Madison, WI",
    colors: { primary: "#C5050C", secondary: "#FFFFFF" },
    radioStation: "WSUM 91.7 FM",
    stats: [
      { icon: "📋", label: "62K+ Applicants" },
      { icon: "🛶", label: "Lake Campus Culture" },
      { icon: "🦡", label: "Badger Spirit" },
    ],
  },
  {
    slug: "minnesota",
    name: "University of Minnesota",
    location: "Minneapolis, MN",
    colors: { primary: "#7A0019", secondary: "#FFCC33" },
    radioStation: "Radio K (KUOM) 100.7 FM",
    stats: [
      { icon: "📋", label: "50K+ Applicants" },
      { icon: "🌆", label: "Twin Cities Access" },
      { icon: "🔬", label: "Strong Research University" },
    ],
  },
  {
    slug: "indiana",
    name: "Indiana University",
    location: "Bloomington, IN",
    colors: { primary: "#990000", secondary: "#EEEDEB" },
    radioStation: "WIUX 99.1 FM",
    stats: [
      { icon: "📋", label: "57K+ Applicants" },
      { icon: "💼", label: "Top Kelley Business School" },
      { icon: "❤️", label: "Hoosier Spirit" },
    ],
  },
  {
    slug: "purdue",
    name: "Purdue University",
    location: "West Lafayette, IN",
    colors: { primary: "#CFB991", secondary: "#000000" },
    radioStation: "WBAA — public radio",
    stats: [
      { icon: "📋", label: "73K+ Applicants" },
      { icon: "🚀", label: "Top Engineering Program" },
      { icon: "🚂", label: "Boilermaker Pride" },
    ],
  },
  {
    slug: "illinois",
    name: "University of Illinois",
    location: "Champaign-Urbana, IL",
    colors: { primary: "#13294B", secondary: "#E84A27" },
    radioStation: "WPGU 107.1 FM",
    stats: [
      { icon: "📋", label: "65K+ Applicants" },
      { icon: "💻", label: "Top Engineering & CS" },
      { icon: "🟠", label: "Illini Spirit" },
    ],
  },
  {
    slug: "iowa",
    name: "University of Iowa",
    location: "Iowa City, IA",
    colors: { primary: "#000000", secondary: "#FFCD00" },
    radioStation: "KRUI 89.7 FM",
    stats: [
      { icon: "📋", label: "32K+ Applicants" },
      { icon: "✍️", label: "Renowned Writing Programs" },
      { icon: "🦅", label: "Hawkeye Spirit" },
    ],
  },
  {
    slug: "nebraska",
    name: "University of Nebraska",
    location: "Lincoln, NE",
    colors: { primary: "#D00000", secondary: "#F5F1E7" },
    radioStation: "KRNU 90.3 FM",
    stats: [
      { icon: "📋", label: "16K+ Applicants" },
      { icon: "🌾", label: "Strong Agriculture Programs" },
      { icon: "🌽", label: "Cornhusker Tradition" },
    ],
  },
  {
    slug: "northwestern",
    name: "Northwestern University",
    location: "Evanston, IL",
    colors: { primary: "#4E2A84", secondary: "#FFFFFF" },
    radioStation: "WNUR 89.3 FM",
    stats: [
      { icon: "📋", label: "52K+ Applicants" },
      { icon: "🎓", label: "Elite Academics" },
      { icon: "🏙️", label: "Chicago-Area Access" },
    ],
  },
  {
    slug: "maryland",
    name: "University of Maryland",
    location: "College Park, MD",
    colors: { primary: "#E21833", secondary: "#FFD200" },
    radioStation: "WMUC 88.1 FM",
    stats: [
      { icon: "📋", label: "42K+ Applicants" },
      { icon: "🏛️", label: "DC-Area Access" },
      { icon: "💻", label: "Strong Journalism & CS" },
    ],
  },
  {
    slug: "rutgers",
    name: "Rutgers University",
    location: "New Brunswick, NJ",
    colors: { primary: "#CC0033", secondary: "#000000" },
    radioStation: "WRSU 88.7 FM",
    stats: [
      { icon: "📋", label: "55K+ Applicants" },
      { icon: "🚆", label: "NYC-Area Access" },
      { icon: "🌎", label: "Highly Diverse Campus" },
    ],
  },
  // Top HBCUs
  {
    slug: "spelman",
    name: "Spelman College",
    location: "Atlanta, GA",
    colors: { primary: "#00308F", secondary: "#FFFFFF" },
    radioStation: "Spelman Radio — online",
    stats: [
      { icon: "📋", label: "12K+ Applicants" },
      { icon: "🏛️", label: "Top HBCU for Women" },
      { icon: "🤝", label: "Atlanta University Center" },
    ],
  },
  {
    slug: "morehouse",
    name: "Morehouse College",
    location: "Atlanta, GA",
    colors: { primary: "#862633", secondary: "#FFFFFF" },
    radioStation: "Morehouse Radio — online",
    stats: [
      { icon: "📋", label: "6K+ Applicants" },
      { icon: "🏛️", label: "Top HBCU for Men" },
      { icon: "🤝", label: "Atlanta University Center" },
    ],
  },
  {
    slug: "hampton",
    name: "Hampton University",
    location: "Hampton, VA",
    colors: { primary: "#0033A0", secondary: "#87CEEB" },
    radioStation: "WHOV 88.1 FM \"The Roar\"",
    stats: [
      { icon: "📋", label: "12K+ Applicants" },
      { icon: "🌊", label: "Coastal Virginia Campus" },
      { icon: "🏥", label: "Strong Nursing & Pharmacy" },
    ],
  },
  {
    slug: "ncat",
    name: "North Carolina A&T",
    location: "Greensboro, NC",
    colors: { primary: "#003B6F", secondary: "#FFB81C" },
    radioStation: "WNAA 90.1 FM",
    stats: [
      { icon: "📋", label: "21K+ Applicants" },
      { icon: "🏛️", label: "Largest HBCU by Enrollment" },
      { icon: "🔧", label: "Strong Engineering" },
    ],
  },
  {
    slug: "tsu",
    name: "Tennessee State",
    location: "Nashville, TN",
    colors: { primary: "#0047AB", secondary: "#FFFFFF" },
    radioStation: "Tiger Radio — online",
    stats: [
      { icon: "📋", label: "12K+ Applicants" },
      { icon: "✈️", label: "Strong Aviation Program" },
      { icon: "🎸", label: "Nashville HBCU" },
    ],
  },
  {
    slug: "morganstate",
    name: "Morgan State",
    location: "Baltimore, MD",
    colors: { primary: "#002868", secondary: "#F2A900" },
    radioStation: "WEAA 88.9 FM",
    stats: [
      { icon: "📋", label: "17K+ Applicants" },
      { icon: "🔧", label: "Strong Engineering" },
      { icon: "🏙️", label: "Baltimore HBCU" },
    ],
  },
  {
    slug: "tuskegee",
    name: "Tuskegee University",
    location: "Tuskegee, AL",
    colors: { primary: "#9D2235", secondary: "#C5A05F" },
    radioStation: "Golden Tiger Radio — online",
    stats: [
      { icon: "📋", label: "9K+ Applicants" },
      { icon: "🏛️", label: "Historic Legacy" },
      { icon: "🔬", label: "Strong STEM & Vet Medicine" },
    ],
  },
  {
    slug: "clarkatl",
    name: "Clark Atlanta University",
    location: "Atlanta, GA",
    colors: { primary: "#CE1126", secondary: "#000000" },
    radioStation: "WCLK 91.9 FM",
    stats: [
      { icon: "📋", label: "10K+ Applicants" },
      { icon: "🤝", label: "Atlanta University Center" },
      { icon: "🎥", label: "Strong Mass Media Program" },
    ],
  },
  {
    slug: "bcu",
    name: "Bethune-Cookman University",
    location: "Daytona Beach, FL",
    colors: { primary: "#862633", secondary: "#C5A05F" },
    radioStation: "Wildcat Radio — online",
    stats: [
      { icon: "📋", label: "7K+ Applicants" },
      { icon: "🏖️", label: "Daytona Beach HBCU" },
      { icon: "📚", label: "Legacy in Education" },
    ],
  },
  {
    slug: "fisk",
    name: "Fisk University",
    location: "Nashville, TN",
    colors: { primary: "#002868", secondary: "#FFC72C" },
    radioStation: "Fisk Radio — online",
    stats: [
      { icon: "📋", label: "3K+ Applicants" },
      { icon: "🎶", label: "Historic Jubilee Singers Legacy" },
      { icon: "🎸", label: "Nashville HBCU" },
    ],
  },
  {
    slug: "xula",
    name: "Xavier University Louisiana",
    location: "New Orleans, LA",
    colors: { primary: "#00205B", secondary: "#FFB81C" },
    radioStation: "Gold Rush Radio — online",
    stats: [
      { icon: "📋", label: "6K+ Applicants" },
      { icon: "🔬", label: "Top Producer of Black STEM Grads" },
      { icon: "🎷", label: "New Orleans HBCU" },
    ],
  },
  {
    slug: "delawarestate",
    name: "Delaware State",
    location: "Dover, DE",
    colors: { primary: "#C8102E", secondary: "#002D72" },
    radioStation: "WDSC 90.7 FM",
    stats: [
      { icon: "📋", label: "14K+ Applicants" },
      { icon: "✈️", label: "Strong Aviation Program" },
      { icon: "🏛️", label: "Dover HBCU" },
    ],
  },
  // Elite Privates
  {
    slug: "harvard",
    name: "Harvard University",
    location: "Cambridge, MA",
    colors: { primary: "#A51C30", secondary: "#FFFFFF" },
    radioStation: "WHRB 95.3 FM",
    stats: [
      { icon: "📋", label: "61K+ Applicants" },
      { icon: "🏛️", label: "Oldest US University" },
      { icon: "🤝", label: "Elite Alumni Network" },
    ],
  },
  {
    slug: "yale",
    name: "Yale University",
    location: "New Haven, CT",
    colors: { primary: "#00356B", secondary: "#FFFFFF" },
    radioStation: "WYBC — online",
    stats: [
      { icon: "📋", label: "50K+ Applicants" },
      { icon: "🏛️", label: "Ivy League Prestige" },
      { icon: "🏠", label: "Strong Residential College System" },
    ],
  },
  {
    slug: "princeton",
    name: "Princeton University",
    location: "Princeton, NJ",
    colors: { primary: "#E77500", secondary: "#000000" },
    radioStation: "WPRB 103.3 FM",
    stats: [
      { icon: "📋", label: "40K+ Applicants" },
      { icon: "💰", label: "No-Loan Financial Aid" },
      { icon: "🎓", label: "Small, Intimate Ivy" },
    ],
  },
  {
    slug: "columbia",
    name: "Columbia University",
    location: "New York, NY",
    colors: { primary: "#B9D9EB", secondary: "#FFFFFF" },
    radioStation: "WKCR 89.9 FM",
    stats: [
      { icon: "📋", label: "60K+ Applicants" },
      { icon: "🏙️", label: "NYC Location" },
      { icon: "📚", label: "Famous Core Curriculum" },
    ],
  },
  {
    slug: "cornell",
    name: "Cornell University",
    location: "Ithaca, NY",
    colors: { primary: "#B31B1B", secondary: "#FFFFFF" },
    radioStation: "WVBR 93.5 FM",
    stats: [
      { icon: "📋", label: "70K+ Applicants" },
      { icon: "🌉", label: "Beautiful Ithaca Gorges" },
      { icon: "🎓", label: "Ivy League with Land-Grant Mission" },
    ],
  },
  {
    slug: "upenn",
    name: "University of Pennsylvania",
    location: "Philadelphia, PA",
    colors: { primary: "#011F5B", secondary: "#990000" },
    radioStation: "WQHS — online",
    stats: [
      { icon: "📋", label: "60K+ Applicants" },
      { icon: "💼", label: "Wharton Business School" },
      { icon: "🏙️", label: "Urban Ivy Campus" },
    ],
  },
  {
    slug: "georgetown",
    name: "Georgetown University",
    location: "Washington, DC",
    colors: { primary: "#041E42", secondary: "#8D817A" },
    radioStation: "WGTB — online",
    stats: [
      { icon: "📋", label: "28K+ Applicants" },
      { icon: "🏛️", label: "DC Political Access" },
      { icon: "🌎", label: "Top International Affairs Program" },
    ],
  },
  {
    slug: "emory",
    name: "Emory University",
    location: "Atlanta, GA",
    colors: { primary: "#012169", secondary: "#F2A900" },
    radioStation: "WMRE — online",
    stats: [
      { icon: "📋", label: "33K+ Applicants" },
      { icon: "🩺", label: "Strong Pre-Med Track" },
      { icon: "🏙️", label: "Atlanta Location" },
    ],
  },
  {
    slug: "tulane",
    name: "Tulane University",
    location: "New Orleans, LA",
    colors: { primary: "#006747", secondary: "#418FDE" },
    radioStation: "WTUL 91.5 FM",
    stats: [
      { icon: "📋", label: "47K+ Applicants" },
      { icon: "🎷", label: "New Orleans Culture" },
      { icon: "🩺", label: "Strong Public Health Program" },
    ],
  },
  {
    slug: "jmu",
    name: "James Madison University",
    location: "Harrisonburg, VA",
    colors: { primary: "#450084", secondary: "#CBB677" },
    radioStation: "WXJM 88.7 FM",
    stats: [
      { icon: "📋", label: "24K+ Applicants" },
      { icon: "🎺", label: "Top-Ranked Marching Band" },
      { icon: "🏔️", label: "Shenandoah Valley Setting" },
    ],
  },
  {
    slug: "pvamu",
    name: "Prairie View A&M",
    location: "Prairie View, TX",
    colors: { primary: "#4F2D7F", secondary: "#FFB81C" },
    radioStation: "KPVU 91.3 FM",
    stats: [
      { icon: "📋", label: "5K+ Applicants" },
      { icon: "🐾", label: "Home of the Panthers" },
      { icon: "🏆", label: "SWAC Football Tradition" },
    ],
  },
  {
    slug: "grambling",
    name: "Grambling State",
    location: "Grambling, LA",
    colors: { primary: "#F0A500", secondary: "#000000" },
    radioStation: "KGRM 91.5 FM",
    stats: [
      { icon: "📋", label: "3K+ Applicants" },
      { icon: "🎺", label: "World-Famous Tiger Band" },
      { icon: "🏈", label: "Legendary Coach Eddie Robinson" },
    ],
  },
  {
    slug: "southern",
    name: "Southern University",
    location: "Baton Rouge, LA",
    colors: { primary: "#00539F", secondary: "#F0A500" },
    radioStation: "WBSB 91.1 FM",
    stats: [
      { icon: "📋", label: "4K+ Applicants" },
      { icon: "🎷", label: "Human Jukebox Marching Band" },
      { icon: "⚖️", label: "Top HBCU Law School" },
    ],
  },
  {
    slug: "jacksonstate",
    name: "Jackson State",
    location: "Jackson, MS",
    colors: { primary: "#00539F", secondary: "#F0A500" },
    radioStation: "WJSU 88.5 FM",
    stats: [
      { icon: "📋", label: "4K+ Applicants" },
      { icon: "🐯", label: "Sonic Boom of the South" },
      { icon: "🌆", label: "Heart of Mississippi's Capital" },
    ],
  },
  {
    slug: "alcornstate",
    name: "Alcorn State",
    location: "Lorman, MS",
    colors: { primary: "#5C2D82", secondary: "#C8A84B" },
    radioStation: "WPRL 91.7 FM",
    stats: [
      { icon: "📋", label: "2K+ Applicants" },
      { icon: "🏛️", label: "Oldest Public HBCU (1871)" },
      { icon: "🌾", label: "Scenic Rural Mississippi Campus" },
    ],
  },
  {
    slug: "mvsu",
    name: "Mississippi Valley State",
    location: "Itta Bena, MS",
    colors: { primary: "#006338", secondary: "#FFD700" },
    radioStation: "WVVS 90.7 FM",
    stats: [
      { icon: "📋", label: "1K+ Applicants" },
      { icon: "🦅", label: "Home of the Delta Devils" },
      { icon: "🎵", label: "Deep in the Mississippi Delta" },
    ],
  },
  {
    slug: "aamu",
    name: "Alabama A&M",
    location: "Normal, AL",
    colors: { primary: "#4B0082", secondary: "#FFD700" },
    radioStation: "WJAB 90.9 FM",
    stats: [
      { icon: "📋", label: "6K+ Applicants" },
      { icon: "🔭", label: "Strong STEM & Research Focus" },
      { icon: "🐉", label: "Maroon & Gold Bulldogs" },
    ],
  },
  {
    slug: "alabamastate",
    name: "Alabama State",
    location: "Montgomery, AL",
    colors: { primary: "#000000", secondary: "#C8A84B" },
    radioStation: "WHBB — online",
    stats: [
      { icon: "📋", label: "5K+ Applicants" },
      { icon: "✊", label: "Civil Rights Movement Legacy" },
      { icon: "🎶", label: "Mighty Marching Hornets Band" },
    ],
  },
  {
    slug: "famu",
    name: "Florida A&M",
    location: "Tallahassee, FL",
    colors: { primary: "#FF6600", secondary: "#006600" },
    radioStation: "WANM 90.5 FM",
    stats: [
      { icon: "📋", label: "14K+ Applicants" },
      { icon: "🥁", label: "Marching 100 Band Fame" },
      { icon: "💊", label: "Top Ranked HBCU Pharmacy School" },
    ],
  },
  {
    slug: "texassouthern",
    name: "Texas Southern",
    location: "Houston, TX",
    colors: { primary: "#4B0082", secondary: "#808080" },
    radioStation: "KTSU 90.9 FM",
    stats: [
      { icon: "📋", label: "7K+ Applicants" },
      { icon: "🌆", label: "Located in Downtown Houston" },
      { icon: "⚖️", label: "Nationally Recognized Law School" },
    ],
  },
  {
    slug: "uapb",
    name: "Arkansas Pine Bluff",
    location: "Pine Bluff, AR",
    colors: { primary: "#F5C300", secondary: "#000000" },
    radioStation: "KPBJ — online",
    stats: [
      { icon: "📋", label: "2K+ Applicants" },
      { icon: "🦁", label: "Home of the Golden Lions" },
      { icon: "🎣", label: "Strong Aquaculture Program" },
    ],
  },
  {
    slug: "appstate",
    name: "Appalachian State",
    location: "Boone, NC",
    colors: { primary: "#FFD100", secondary: "#000000" },
    radioStation: "WASU 90.5 FM",
    stats: [
      { icon: "📋", label: "14K+ Applicants" },
      { icon: "🏔️", label: "Blue Ridge Mountains Campus" },
      { icon: "🏈", label: "FBS Mountaineers Football" },
    ],
  },
  {
    slug: "coastalcarolina",
    name: "Coastal Carolina",
    location: "Conway, SC",
    colors: { primary: "#006F51", secondary: "#A27752" },
    radioStation: "Chanticleer Radio — online",
    stats: [
      { icon: "📋", label: "11K+ Applicants" },
      { icon: "🌊", label: "Near Myrtle Beach" },
      { icon: "⚾", label: "Powerhouse Baseball Program" },
    ],
  },
  {
    slug: "georgiasouthern",
    name: "Georgia Southern",
    location: "Statesboro, GA",
    colors: { primary: "#011E41", secondary: "#C8A456" },
    radioStation: "WVGS 91.9 FM",
    stats: [
      { icon: "📋", label: "13K+ Applicants" },
      { icon: "🦅", label: "Eagles Strong School Spirit" },
      { icon: "🏈", label: "Historic Option Football" },
    ],
  },
  {
    slug: "georgiastate",
    name: "Georgia State",
    location: "Atlanta, GA",
    colors: { primary: "#0039A6", secondary: "#CC0000" },
    radioStation: "WRAS 88.5 FM",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "🏙️", label: "Heart of Downtown Atlanta" },
      { icon: "🎓", label: "Top Urban Research University" },
    ],
  },
  {
    slug: "marshall",
    name: "Marshall University",
    location: "Huntington, WV",
    colors: { primary: "#00B140", secondary: "#000000" },
    radioStation: "WMUL 88.1 FM",
    stats: [
      { icon: "📋", label: "5K+ Applicants" },
      { icon: "🕊️", label: "We Are Marshall Legacy" },
      { icon: "💼", label: "Strong Business College" },
    ],
  },
  {
    slug: "odu",
    name: "Old Dominion",
    location: "Norfolk, VA",
    colors: { primary: "#003057", secondary: "#7AA0C4" },
    radioStation: "WODU 89.1 FM",
    stats: [
      { icon: "📋", label: "10K+ Applicants" },
      { icon: "⚓", label: "Navy Town Coastal Culture" },
      { icon: "🚀", label: "NASA Langley Research Access" },
    ],
  },
  {
    slug: "southalabama",
    name: "South Alabama",
    location: "Mobile, AL",
    colors: { primary: "#003087", secondary: "#BF0D3E" },
    radioStation: "WHIL 91.3 FM",
    stats: [
      { icon: "📋", label: "7K+ Applicants" },
      { icon: "🌴", label: "Gulf Coast Location" },
      { icon: "🏥", label: "Top Medical Program" },
    ],
  },
  {
    slug: "southernmiss",
    name: "Southern Miss",
    location: "Hattiesburg, MS",
    colors: { primary: "#FFD100", secondary: "#000000" },
    radioStation: "WUSM 88.5 FM",
    stats: [
      { icon: "📋", label: "5K+ Applicants" },
      { icon: "🦅", label: "Golden Eagles Strong Pride" },
      { icon: "🌪️", label: "Top Meteorology Program" },
    ],
  },
  {
    slug: "texasstate",
    name: "Texas State",
    location: "San Marcos, TX",
    colors: { primary: "#501214", secondary: "#8B8B00" },
    radioStation: "KTSW 90.5 FM",
    stats: [
      { icon: "📋", label: "30K+ Applicants" },
      { icon: "🏞️", label: "San Marcos River Campus" },
      { icon: "📰", label: "Top Mass Comm Program" },
    ],
  },
  {
    slug: "troy",
    name: "Troy University",
    location: "Troy, AL",
    colors: { primary: "#8B0000", secondary: "#A8906A" },
    radioStation: "WTBF 94.7 FM",
    stats: [
      { icon: "📋", label: "6K+ Applicants" },
      { icon: "🌐", label: "Global Campus Network" },
      { icon: "🎵", label: "Acclaimed Sound of the South Band" },
    ],
  },
  {
    slug: "ulm",
    name: "ULM",
    location: "Monroe, LA",
    colors: { primary: "#800000", secondary: "#C4A962" },
    radioStation: "Warhawk Radio — online",
    stats: [
      { icon: "📋", label: "3K+ Applicants" },
      { icon: "💊", label: "Strong Pharmacy School" },
      { icon: "🦅", label: "Warhawks Tight-Knit Community" },
    ],
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    location: "Lafayette, LA",
    colors: { primary: "#CE181E", secondary: "#0A0203" },
    radioStation: "KRVS 88.7 FM",
    stats: [
      { icon: "📋", label: "9K+ Applicants" },
      { icon: "🎷", label: "Heart of Cajun Culture" },
      { icon: "⚡", label: "Top Renewable Energy Research" },
    ],
  },
  {
    slug: "arkansasstate",
    name: "Arkansas State",
    location: "Jonesboro, AR",
    colors: { primary: "#CC0000", secondary: "#000000" },
    radioStation: "KASU 91.9 FM",
    stats: [
      { icon: "📋", label: "8K+ Applicants" },
      { icon: "🐺", label: "Red Wolves Fierce Spirit" },
      { icon: "🏥", label: "Growing Health Sciences Programs" },
    ],
  },
  {
    slug: "ucla",
    name: "UCLA",
    location: "Los Angeles, CA",
    colors: { primary: "#2D68C4", secondary: "#F2A900" },
    radioStation: "KXLU 88.9 FM",
    stats: [
      { icon: "📋", label: "139K+ Applicants" },
      { icon: "🏆", label: "119 NCAA Championships" },
      { icon: "🌊", label: "Minutes from the Beach" },
    ],
  },
  {
    slug: "uncc",
    name: "UNC Charlotte",
    location: "Charlotte, NC",
    colors: { primary: "#005035", secondary: "#A49665" },
    radioStation: "Niner Radio — online",
    stats: [
      { icon: "📋", label: "18K+ Applicants" },
      { icon: "🏙️", label: "Major Banking Hub City" },
      { icon: "⛏️", label: "Strong STEM Programs" },
    ],
  },
  {
    slug: "ecu",
    name: "East Carolina University",
    location: "Greenville, NC",
    colors: { primary: "#4B1869", secondary: "#FDC82F" },
    radioStation: "WZMB 91.3 FM",
    stats: [
      { icon: "📋", label: "14K+ Applicants" },
      { icon: "⚓", label: "Top Nursing School" },
      { icon: "🏴‍☠️", label: "Passionate Pirate Spirit" },
    ],
  },
  {
    slug: "fau",
    name: "Florida Atlantic University",
    location: "Boca Raton, FL",
    colors: { primary: "#003366", secondary: "#CC0000" },
    radioStation: "WRGP — online",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "🏖️", label: "Beach Campus Access" },
      { icon: "🦉", label: "Rising Research University" },
    ],
  },
  {
    slug: "memphis",
    name: "University of Memphis",
    location: "Memphis, TN",
    colors: { primary: "#003087", secondary: "#898D8D" },
    radioStation: "WUMR 91.7 FM",
    stats: [
      { icon: "📋", label: "10K+ Applicants" },
      { icon: "🎵", label: "Blues Music Capital" },
      { icon: "🏀", label: "Strong Tigers Hoops" },
    ],
  },
  {
    slug: "navy",
    name: "United States Naval Academy",
    location: "Annapolis, MD",
    colors: { primary: "#00205B", secondary: "#C5B358" },
    radioStation: "WRNV 94.5 FM",
    stats: [
      { icon: "📋", label: "16K+ Applicants" },
      { icon: "⚓", label: "Tuition-Free Federal Academy" },
      { icon: "🐐", label: "Historic Army-Navy Rivalry" },
    ],
  },
  {
    slug: "unt",
    name: "University of North Texas",
    location: "Denton, TX",
    colors: { primary: "#00853E", secondary: "#FFFFFF" },
    radioStation: "KUNT 88.7 FM",
    stats: [
      { icon: "📋", label: "23K+ Applicants" },
      { icon: "🎷", label: "Renowned Jazz Program" },
      { icon: "🦅", label: "Vibrant Denton Arts Scene" },
    ],
  },
  {
    slug: "rice",
    name: "Rice University",
    location: "Houston, TX",
    colors: { primary: "#00205B", secondary: "#C1A875" },
    radioStation: "KTRU — online",
    stats: [
      { icon: "📋", label: "21K+ Applicants" },
      { icon: "🔬", label: "Elite Research Institution" },
      { icon: "🏠", label: "Unique Residential College System" },
    ],
  },
  {
    slug: "usf",
    name: "University of South Florida",
    location: "Tampa, FL",
    colors: { primary: "#006747", secondary: "#CFC493" },
    radioStation: "WBUL 88.5 FM",
    stats: [
      { icon: "📋", label: "30K+ Applicants" },
      { icon: "🌴", label: "Sunny Tampa Bay Location" },
      { icon: "💊", label: "Top Medical Research Programs" },
    ],
  },
  {
    slug: "temple",
    name: "Temple University",
    location: "Philadelphia, PA",
    colors: { primary: "#9D2235", secondary: "#FFFFFF" },
    radioStation: "WHIP 98.9 FM",
    stats: [
      { icon: "📋", label: "34K+ Applicants" },
      { icon: "🔔", label: "Heart of Philadelphia" },
      { icon: "⚖️", label: "Highly Ranked Law School" },
    ],
  },
  {
    slug: "tulsa",
    name: "University of Tulsa",
    location: "Tulsa, OK",
    colors: { primary: "#002D62", secondary: "#C8A44A" },
    radioStation: "KWGS 89.5 FM",
    stats: [
      { icon: "📋", label: "5K+ Applicants" },
      { icon: "🛡️", label: "Top Cybersecurity Program" },
      { icon: "🏈", label: "Strong Golden Hurricane Pride" },
    ],
  },
  {
    slug: "uab",
    name: "UAB",
    location: "Birmingham, AL",
    colors: { primary: "#1E6B52", secondary: "#FFD100" },
    radioStation: "Blazer Radio — online",
    stats: [
      { icon: "📋", label: "9K+ Applicants" },
      { icon: "🏥", label: "Top-Ranked Medical Center" },
      { icon: "🔬", label: "Major NIH Research Funding" },
    ],
  },
  {
    slug: "utsa",
    name: "UTSA",
    location: "San Antonio, TX",
    colors: { primary: "#F15A22", secondary: "#002A5C" },
    radioStation: "KSYM 90.1 FM",
    stats: [
      { icon: "📋", label: "22K+ Applicants" },
      { icon: "🛡️", label: "National Cybersecurity Hub" },
      { icon: "🌮", label: "Rich San Antonio Culture" },
    ],
  },
  {
    slug: "wichitastate",
    name: "Wichita State",
    location: "Wichita, KS",
    colors: { primary: "#000000", secondary: "#FFCD00" },
    radioStation: "KMUW 89.1 FM",
    stats: [
      { icon: "📋", label: "7K+ Applicants" },
      { icon: "✈️", label: "Aerospace Engineering Leader" },
      { icon: "🌾", label: "Largest City in Kansas" },
    ],
  },
  {
    slug: "brown",
    name: "Brown University",
    location: "Providence, RI",
    colors: { primary: "#4E3629", secondary: "#C00404" },
    radioStation: "WBRU 95.5 FM",
    stats: [
      { icon: "📋", label: "46K+ Applicants" },
      { icon: "📖", label: "Open Curriculum" },
      { icon: "🐻", label: "Strong Arts Culture" },
    ],
  },
  {
    slug: "dartmouth",
    name: "Dartmouth College",
    location: "Hanover, NH",
    colors: { primary: "#00693E", secondary: "#12312B" },
    radioStation: "WDCR 1340 AM",
    stats: [
      { icon: "📋", label: "28K+ Applicants" },
      { icon: "🌲", label: "Remote Outdoor Campus" },
      { icon: "🏛️", label: "Small Liberal Arts Focus" },
    ],
  },
  {
    slug: "stthomas",
    name: "University of St. Thomas",
    location: "St. Paul, MN",
    colors: { primary: "#4F2D7F", secondary: "#9D9795" },
    radioStation: "KTOM — online",
    stats: [
      { icon: "📋", label: "8K+ Applicants" },
      { icon: "✝️", label: "Catholic Liberal Arts" },
      { icon: "🏙️", label: "Twin Cities Access" },
    ],
  },
];

export function getSchoolBySlug(slug: string): SchoolMeta | undefined {
  return SCHOOLS.find((s) => s.slug === slug);
}
