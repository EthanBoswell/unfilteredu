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
];

export function getSchoolBySlug(slug: string): SchoolMeta | undefined {
  return SCHOOLS.find((s) => s.slug === slug);
}
