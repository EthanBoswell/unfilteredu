export type CategoryData = {
  summary: string;
  key_quotes: string[];
};

export type Summary = {
  housing: CategoryData;
  social_life: CategoryData;
  dining: CategoryData;
  mental_health: CategoryData;
  financial_aid: CategoryData;
  academics: CategoryData;
  overall_vibe: CategoryData;
  red_flags: CategoryData;
  hidden_gems: CategoryData;
};

export type SchoolMeta = {
  slug: string;
  name: string;
  location: string;
  stats: Array<{ icon: string; label: string }>;
};

export const SCHOOLS: SchoolMeta[] = [
  {
    slug: "unc",
    name: "UNC Chapel Hill",
    location: "Chapel Hill, NC",
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
    stats: [
      { icon: "📋", label: "57K+ Applicants" },
      { icon: "💡", label: "Silicon Valley Access" },
      { icon: "🌲", label: "Beautiful Campus" },
    ],
  },
];

export function getSchoolBySlug(slug: string): SchoolMeta | undefined {
  return SCHOOLS.find((s) => s.slug === slug);
}
