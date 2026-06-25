import argparse
import json
import os
import re
import time

import anthropic
from dotenv import load_dotenv

from scrape_reddit_direct import scrape_school_direct
from scrape_youtube import scrape_youtube

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env")

MODEL = "claude-sonnet-4-6"

# Pricing per token (Claude Sonnet 4.6)
_INPUT_PRICE = 3.0 / 1_000_000
_OUTPUT_PRICE = 15.0 / 1_000_000
_CACHE_WRITE_PRICE = 3.75 / 1_000_000
_CACHE_READ_PRICE = 0.30 / 1_000_000

SCHOOLS = [
    # ACC
    {"name": "Kansas", "slug": "kansas", "subreddits": ["r/KUniversity"], "keywords": ["University of Kansas", "KU Jayhawks", "Lawrence Kansas"]},
    {"name": "University of North Carolina at Chapel Hill", "slug": "unc", "subreddits": ["r/UNC", "r/chapelhill"], "keywords": ["University of North Carolina", "UNC Chapel Hill", "Tar Heels", "Chapel Hill NC"]},
    {"name": "Duke University", "slug": "duke", "subreddits": ["r/duke", "r/DukeUniversity"], "keywords": ["Duke University", "Duke Blue Devils", "Durham NC"]},
    {"name": "NC State", "slug": "ncstate", "subreddits": ["r/NCState"], "keywords": ["NC State", "North Carolina State", "Wolfpack", "Raleigh NC"]},
    {"name": "Georgia Tech", "slug": "georgiatech", "subreddits": ["r/gatech"], "keywords": ["Georgia Tech", "GT", "Yellow Jackets", "Atlanta"]},
    {"name": "University of Virginia", "slug": "uva", "subreddits": ["r/uva"], "keywords": ["UVA", "University of Virginia", "Cavaliers", "Charlottesville"]},
    {"name": "Virginia Tech", "slug": "virginiatech", "subreddits": ["r/VirginiaTech"], "keywords": ["Virginia Tech", "Hokies", "Blacksburg"]},
    {"name": "Florida State", "slug": "fsu", "subreddits": ["r/FloridaState"], "keywords": ["Florida State", "FSU", "Seminoles", "Tallahassee"]},
    {"name": "University of Miami", "slug": "miami", "subreddits": ["r/umiami"], "keywords": ["University of Miami", "UM", "Hurricanes", "Coral Gables"]},
    {"name": "Clemson", "slug": "clemson", "subreddits": ["r/Clemson"], "keywords": ["Clemson", "Tigers", "Clemson SC"]},
    {"name": "Wake Forest", "slug": "wakeforest", "subreddits": ["r/wakeforest"], "keywords": ["Wake Forest", "Demon Deacons", "Winston-Salem"]},
    {"name": "Boston College", "slug": "bc", "subreddits": ["r/bostoncollege"], "keywords": ["Boston College", "BC Eagles", "Chestnut Hill"]},
    {"name": "Syracuse", "slug": "syracuse", "subreddits": ["r/Syracuse", "r/SyracuseU"], "keywords": ["Syracuse University", "Orange", "Syracuse NY"]},
    {"name": "Pitt", "slug": "pitt", "subreddits": ["r/Pitt"], "keywords": ["University of Pittsburgh", "Pitt", "Panthers", "Pittsburgh"]},
    {"name": "Louisville", "slug": "louisville", "subreddits": ["r/uofl"], "keywords": ["University of Louisville", "UofL", "Cardinals", "Louisville KY"]},
    {"name": "Notre Dame", "slug": "notredame", "subreddits": ["r/notredame"], "keywords": ["Notre Dame", "Fighting Irish", "South Bend"]},
    {"name": "UC Berkeley", "slug": "ucberkeley", "subreddits": ["r/berkeley", "r/UCBerkeley"], "keywords": ["UC Berkeley", "University of California Berkeley", "Cal Bears", "Berkeley CA"]},
    {"name": "Southern Methodist University", "slug": "smu", "subreddits": ["r/SMU"], "keywords": ["SMU", "Southern Methodist University", "Mustangs", "Dallas TX"]},
    {"name": "Stanford", "slug": "stanford", "subreddits": ["r/Stanford"], "keywords": ["Stanford University", "Cardinal", "Palo Alto", "Stanford CA"]},
    {"name": "Howard University", "slug": "howard", "subreddits": ["r/HowardUniversity", "r/HBCU"], "keywords": ["Howard University", "Bison", "Washington DC", "HBCU", "Howard HBCU"]},
    # SEC
    {"name": "University of Alabama", "slug": "alabama", "subreddits": ["r/uAlabama"], "keywords": ["University of Alabama", "Alabama Crimson Tide", "Tuscaloosa", "UA campus"]},
    {"name": "Auburn University", "slug": "auburn", "subreddits": ["r/auburn"], "keywords": ["Auburn University", "War Eagle", "Auburn Alabama", "Auburn campus"]},
    {"name": "University of Florida", "slug": "florida", "subreddits": ["r/ufl", "r/gainesville"], "keywords": ["University of Florida", "UF", "Gators", "Gainesville"]},
    {"name": "University of Georgia", "slug": "uga", "subreddits": ["r/UGA"], "keywords": ["University of Georgia", "UGA", "Bulldogs", "Athens Georgia"]},
    {"name": "University of Tennessee", "slug": "tennessee", "subreddits": ["r/UTK"], "keywords": ["University of Tennessee", "UTK", "Volunteers", "Knoxville"]},
    {"name": "University of Kentucky", "slug": "kentucky", "subreddits": ["r/uky"], "keywords": ["University of Kentucky", "UK", "Wildcats", "Lexington Kentucky"]},
    {"name": "University of South Carolina", "slug": "southcarolina", "subreddits": ["r/uofsc"], "keywords": ["University of South Carolina", "Gamecocks", "Columbia SC"]},
    {"name": "University of Southern California", "slug": "usc", "subreddits": ["r/USC"], "keywords": ["University of Southern California", "USC Trojans", "Trojans", "USC Los Angeles"]},
    {"name": "Louisiana State University", "slug": "lsu", "subreddits": ["r/LSU"], "keywords": ["LSU", "Louisiana State", "Tigers", "Baton Rouge"]},
    {"name": "Ole Miss", "slug": "olemiss", "subreddits": ["r/OleMiss"], "keywords": ["Ole Miss", "University of Mississippi", "Rebels", "Oxford Mississippi"]},
    {"name": "Mississippi State", "slug": "msstate", "subreddits": ["r/msstate"], "keywords": ["Mississippi State", "Bulldogs", "Starkville", "MSU Mississippi"]},
    {"name": "University of Arkansas", "slug": "arkansas", "subreddits": ["r/uofarkansas"], "keywords": ["University of Arkansas", "Razorbacks", "Fayetteville Arkansas"]},
    {"name": "Texas A&M", "slug": "tamu", "subreddits": ["r/aggies"], "keywords": ["Texas A&M", "Aggies", "College Station", "TAMU"]},
    {"name": "University of Texas", "slug": "texas", "subreddits": ["r/UTAustin"], "keywords": ["University of Texas", "UT Austin", "Longhorns", "Austin Texas"]},
    {"name": "Vanderbilt University", "slug": "vanderbilt", "subreddits": ["r/vanderbilt"], "keywords": ["Vanderbilt", "Commodores", "Nashville Tennessee"]},
    {"name": "Missouri University", "slug": "missouri", "subreddits": ["r/mizzou"], "keywords": ["University of Missouri", "Mizzou", "Tigers", "Columbia Missouri"]},
    {"name": "Oklahoma University", "slug": "oklahoma", "subreddits": ["r/uoklahoma"], "keywords": ["University of Oklahoma", "Sooners", "Norman Oklahoma"]},
    # Big 12
    {"name": "Kansas State", "slug": "kstate", "subreddits": ["r/KStateUniversity"], "keywords": ["Kansas State", "K-State", "Wildcats Manhattan Kansas"]},
    {"name": "Iowa State", "slug": "iowastate", "subreddits": ["r/iastate"], "keywords": ["Iowa State University", "Cyclones", "Ames Iowa"]},
    {"name": "Baylor University", "slug": "baylor", "subreddits": ["r/baylor"], "keywords": ["Baylor University", "Bears", "Waco Texas"]},
    {"name": "TCU", "slug": "tcu", "subreddits": ["r/tcu"], "keywords": ["TCU", "Texas Christian University", "Horned Frogs", "Fort Worth"]},
    {"name": "West Virginia University", "slug": "wvu", "subreddits": ["r/wvu"], "keywords": ["West Virginia University", "WVU", "Mountaineers", "Morgantown"]},
    {"name": "University of Cincinnati", "slug": "cincinnati", "subreddits": ["r/uofcincy"], "keywords": ["University of Cincinnati", "UC Bearcats", "Cincinnati Ohio"]},
    {"name": "University of Houston", "slug": "houston", "subreddits": ["r/UniversityOfHouston"], "keywords": ["University of Houston", "UH Cougars", "Houston Texas"]},
    {"name": "UCF", "slug": "ucf", "subreddits": ["r/ucf"], "keywords": ["UCF", "University of Central Florida", "Knights", "Orlando"]},
    {"name": "BYU", "slug": "byu", "subreddits": ["r/byu"], "keywords": ["BYU", "Brigham Young University", "Cougars", "Provo Utah"]},
    {"name": "University of Utah", "slug": "utah", "subreddits": ["r/uofutah"], "keywords": ["University of Utah", "Utes", "Salt Lake City"]},
    {"name": "University of Colorado", "slug": "colorado", "subreddits": ["r/cuboulder"], "keywords": ["CU Boulder", "Colorado Buffaloes", "Boulder Colorado"]},
    {"name": "University of Arizona", "slug": "arizona", "subreddits": ["r/uofaz"], "keywords": ["University of Arizona", "Wildcats", "Tucson Arizona"]},
    {"name": "Arizona State", "slug": "asu", "subreddits": ["r/ASU"], "keywords": ["Arizona State University", "ASU Sun Devils", "Tempe Arizona"]},
    {"name": "Oklahoma State", "slug": "okstate", "subreddits": ["r/okstate"], "keywords": ["Oklahoma State", "Cowboys", "Stillwater Oklahoma"]},
    {"name": "Texas Tech University", "slug": "texastech", "subreddits": ["r/TexasTech"], "keywords": ["Texas Tech", "Red Raiders", "Lubbock Texas"]},
    # Big Ten
    {"name": "University of Michigan", "slug": "michigan", "subreddits": ["r/uofm"], "keywords": ["University of Michigan", "Wolverines", "Ann Arbor Michigan"]},
    {"name": "Michigan State", "slug": "michiganstate", "subreddits": ["r/msu"], "keywords": ["Michigan State University", "Spartans", "East Lansing"]},
    {"name": "Ohio State", "slug": "ohiostate", "subreddits": ["r/OSU"], "keywords": ["Ohio State University", "Buckeyes", "Columbus Ohio"]},
    {"name": "Penn State", "slug": "pennstate", "subreddits": ["r/PennStateUniversity"], "keywords": ["Penn State", "Nittany Lions", "State College Pennsylvania"]},
    {"name": "University of Wisconsin", "slug": "wisconsin", "subreddits": ["r/UWMadison"], "keywords": ["University of Wisconsin", "Badgers", "Madison Wisconsin"]},
    {"name": "University of Minnesota", "slug": "minnesota", "subreddits": ["r/uofmn"], "keywords": ["University of Minnesota", "Gophers", "Minneapolis Minnesota"]},
    {"name": "Indiana University", "slug": "indiana", "subreddits": ["r/IndianaUniversity"], "keywords": ["Indiana University", "Hoosiers", "Bloomington Indiana"]},
    {"name": "Purdue University", "slug": "purdue", "subreddits": ["r/Purdue"], "keywords": ["Purdue University", "Boilermakers", "West Lafayette Indiana"]},
    {"name": "University of Illinois", "slug": "illinois", "subreddits": ["r/UIUC"], "keywords": ["University of Illinois", "Illini", "Champaign Illinois"]},
    {"name": "University of Iowa", "slug": "iowa", "subreddits": ["r/uiowa"], "keywords": ["University of Iowa", "Hawkeyes", "Iowa City"]},
    {"name": "University of Nebraska", "slug": "nebraska", "subreddits": ["r/unl"], "keywords": ["University of Nebraska", "Cornhuskers", "Lincoln Nebraska"]},
    {"name": "Northwestern University", "slug": "northwestern", "subreddits": ["r/Northwestern"], "keywords": ["Northwestern University", "Wildcats", "Evanston Illinois"]},
    {"name": "University of Maryland", "slug": "maryland", "subreddits": ["r/UMD"], "keywords": ["University of Maryland", "Terrapins", "College Park Maryland"]},
    {"name": "Rutgers University", "slug": "rutgers", "subreddits": ["r/rutgers"], "keywords": ["Rutgers University", "Scarlet Knights", "New Brunswick New Jersey"]},
    {"name": "UCLA", "slug": "ucla", "subreddits": ["r/UCLA"], "keywords": ["UCLA", "University of California Los Angeles", "Bruins", "Westwood California"]},
    # Top HBCUs
    {"name": "Spelman College", "slug": "spelman", "subreddits": ["r/SpelmanCollege", "r/HBCU"], "keywords": ["Spelman College", "Atlanta HBCU", "Spelman women"]},
    {"name": "Morehouse College", "slug": "morehouse", "subreddits": ["r/Morehouse", "r/HBCU"], "keywords": ["Morehouse College", "Atlanta HBCU", "Morehouse men"]},
    {"name": "Hampton University", "slug": "hampton", "subreddits": ["r/HamptonUniversity", "r/HBCU"], "keywords": ["Hampton University", "Hampton Pirates", "Virginia HBCU"]},
    {"name": "North Carolina A&T", "slug": "ncat", "subreddits": ["r/NCAT", "r/HBCU"], "keywords": ["NC A&T", "North Carolina A&T", "Aggies", "Greensboro HBCU"]},
    {"name": "Tennessee State", "slug": "tsu", "subreddits": ["r/TennesseeState", "r/HBCU"], "keywords": ["Tennessee State University", "TSU Tigers", "Nashville HBCU"]},
    {"name": "Morgan State", "slug": "morganstate", "subreddits": ["r/MorganState", "r/HBCU"], "keywords": ["Morgan State University", "Bears", "Baltimore HBCU"]},
    {"name": "Tuskegee University", "slug": "tuskegee", "subreddits": ["r/Tuskegee", "r/HBCU"], "keywords": ["Tuskegee University", "Golden Tigers", "Alabama HBCU"]},
    {"name": "Clark Atlanta University", "slug": "clarkatl", "subreddits": ["r/ClarkAtlanta", "r/HBCU"], "keywords": ["Clark Atlanta University", "CAU Panthers", "Atlanta HBCU"]},
    {"name": "Bethune-Cookman University", "slug": "bcu", "subreddits": ["r/BethuneCookman", "r/HBCU"], "keywords": ["Bethune-Cookman", "BCU Wildcats", "Daytona Beach HBCU"]},
    {"name": "Fisk University", "slug": "fisk", "subreddits": ["r/FiskUniversity", "r/HBCU"], "keywords": ["Fisk University", "Bulldogs", "Nashville HBCU"]},
    {"name": "Xavier University Louisiana", "slug": "xula", "subreddits": ["r/XavierUniversity", "r/HBCU"], "keywords": ["Xavier University Louisiana", "Gold Rush", "New Orleans HBCU"]},
    {"name": "Delaware State", "slug": "delawarestate", "subreddits": ["r/DelawareState", "r/HBCU"], "keywords": ["Delaware State University", "Hornets", "Dover HBCU"]},
    # Elite privates
    {"name": "Harvard University", "slug": "harvard", "subreddits": ["r/Harvard"], "keywords": ["Harvard University", "Crimson", "Cambridge Massachusetts"]},
    {"name": "Yale University", "slug": "yale", "subreddits": ["r/yale"], "keywords": ["Yale University", "Bulldogs", "New Haven Connecticut"]},
    {"name": "Princeton University", "slug": "princeton", "subreddits": ["r/Princeton"], "keywords": ["Princeton University", "Tigers", "Princeton New Jersey"]},
    {"name": "Columbia University", "slug": "columbia", "subreddits": ["r/columbia"], "keywords": ["Columbia University", "Lions", "New York City Ivy League"]},
    {"name": "Cornell University", "slug": "cornell", "subreddits": ["r/Cornell"], "keywords": ["Cornell University", "Big Red", "Ithaca New York"]},
    {"name": "University of Pennsylvania", "slug": "upenn", "subreddits": ["r/UPenn"], "keywords": ["UPenn", "University of Pennsylvania", "Quakers", "Philadelphia"]},
    {"name": "Georgetown University", "slug": "georgetown", "subreddits": ["r/georgetown"], "keywords": ["Georgetown University", "Hoyas", "Washington DC"]},
    {"name": "Emory University", "slug": "emory", "subreddits": ["r/EmoryUniversity"], "keywords": ["Emory University", "Eagles", "Atlanta Georgia"]},
    {"name": "Tulane University", "slug": "tulane", "subreddits": ["r/tulane"], "keywords": ["Tulane University", "Green Wave", "New Orleans Louisiana"]},
    {"name": "Brown University", "slug": "brown", "subreddits": ["r/brownu"], "keywords": ["Brown University", "Bears", "Providence Rhode Island", "Ivy League"]},
    {"name": "Dartmouth College", "slug": "dartmouth", "subreddits": ["r/Dartmouth"], "keywords": ["Dartmouth College", "Big Green", "Hanover New Hampshire", "Ivy League"]},
    # SWAC
    {"name": "Prairie View A&M", "slug": "pvamu", "subreddits": ["r/PVAMU", "r/PrairieView"], "keywords": ["Prairie View A&M", "PVAMU", "Panther City", "Prairie View Texas", "HBCU Texas"]},
    {"name": "Grambling State", "slug": "grambling", "subreddits": ["r/GramblingState"], "keywords": ["Grambling State", "Grambling", "Tigers", "Louisiana HBCU"]},
    {"name": "Southern University", "slug": "southern", "subreddits": ["r/SouthernUniversity"], "keywords": ["Southern University", "Jaguars", "Baton Rouge HBCU"]},
    {"name": "Jackson State", "slug": "jacksonstate", "subreddits": ["r/JacksonState"], "keywords": ["Jackson State", "JSU", "Tigers", "Mississippi HBCU"]},
    {"name": "Alcorn State", "slug": "alcornstate", "subreddits": ["r/AlcornState"], "keywords": ["Alcorn State", "Braves", "Mississippi HBCU", "Lorman"]},
    {"name": "Mississippi Valley State", "slug": "mvsu", "subreddits": ["r/MVSU"], "keywords": ["Mississippi Valley State", "MVSU", "Delta Devils", "Itta Bena"]},
    {"name": "Alabama A&M", "slug": "aamu", "subreddits": ["r/AlabamaAM"], "keywords": ["Alabama A&M", "AAMU", "Bulldogs", "Normal Alabama HBCU"]},
    {"name": "Alabama State", "slug": "alabamastate", "subreddits": ["r/AlabamaState"], "keywords": ["Alabama State", "ASU", "Hornets", "Montgomery HBCU"]},
    {"name": "Florida A&M", "slug": "famu", "subreddits": ["r/FAMU", "r/FloridaAM"], "keywords": ["Florida A&M", "FAMU", "Rattlers", "Tallahassee HBCU"]},
    {"name": "Texas Southern", "slug": "texassouthern", "subreddits": ["r/TexasSouthern"], "keywords": ["Texas Southern", "TSU", "Tigers", "Houston HBCU"]},
    {"name": "Arkansas Pine Bluff", "slug": "uapb", "subreddits": ["r/UAPB"], "keywords": ["Arkansas Pine Bluff", "UAPB", "Golden Lions", "Arkansas HBCU"]},
    # Sun Belt
    {"name": "Appalachian State", "slug": "appstate", "subreddits": ["r/AppState"], "keywords": ["Appalachian State", "App State", "Mountaineers", "Boone North Carolina"]},
    {"name": "Coastal Carolina", "slug": "coastalcarolina", "subreddits": ["r/CoastalCarolina"], "keywords": ["Coastal Carolina University", "Chanticleers", "Conway South Carolina"]},
    {"name": "Georgia Southern", "slug": "georgiasouthern", "subreddits": ["r/GeorgiaSouthern"], "keywords": ["Georgia Southern University", "Eagles", "Statesboro Georgia"]},
    {"name": "Georgia State", "slug": "georgiastate", "subreddits": ["r/GeorgiaStateUniversity"], "keywords": ["Georgia State University", "Panthers", "Atlanta Georgia"]},
    {"name": "Marshall University", "slug": "marshall", "subreddits": ["r/MarshallUniversity"], "keywords": ["Marshall University", "Thundering Herd", "Huntington West Virginia"]},
    {"name": "Old Dominion", "slug": "odu", "subreddits": ["r/ODU"], "keywords": ["Old Dominion University", "Monarchs", "Norfolk Virginia"]},
    {"name": "South Alabama", "slug": "southalabama", "subreddits": ["r/USouthAL"], "keywords": ["University of South Alabama", "Jaguars", "Mobile Alabama"]},
    {"name": "Southern Miss", "slug": "southernmiss", "subreddits": ["r/SouthernMiss"], "keywords": ["Southern Miss", "University of Southern Mississippi", "Golden Eagles", "Hattiesburg"]},
    {"name": "Texas State", "slug": "texasstate", "subreddits": ["r/texasstate"], "keywords": ["Texas State University", "Bobcats", "San Marcos Texas"]},
    {"name": "Troy University", "slug": "troy", "subreddits": ["r/TroyUniversity"], "keywords": ["Troy University", "Trojans", "Troy Alabama"]},
    {"name": "ULM", "slug": "ulm", "subreddits": ["r/ULMonroe"], "keywords": ["University of Louisiana Monroe", "ULM Warhawks", "Monroe Louisiana"]},
    {"name": "Louisiana", "slug": "louisiana", "subreddits": ["r/RaginCajuns"], "keywords": ["University of Louisiana Lafayette", "Ragin Cajuns", "Lafayette Louisiana"]},
    {"name": "James Madison University", "slug": "jmu", "subreddits": ["r/JMU"], "keywords": ["James Madison University", "JMU Dukes", "Harrisonburg Virginia"]},
    {"name": "Arkansas State", "slug": "arkansasstate", "subreddits": ["r/ArkansasState"], "keywords": ["Arkansas State University", "Red Wolves", "Jonesboro Arkansas"]},
    # American Athletic Conference
    {"name": "UNC Charlotte", "slug": "uncc", "subreddits": ["r/uncc"], "keywords": ["UNC Charlotte", "49ers", "Charlotte North Carolina"]},
    {"name": "East Carolina University", "slug": "ecu", "subreddits": ["r/ECU"], "keywords": ["East Carolina University", "ECU Pirates", "Greenville North Carolina"]},
    {"name": "Florida Atlantic University", "slug": "fau", "subreddits": ["r/FAU"], "keywords": ["Florida Atlantic University", "FAU Owls", "Boca Raton Florida"]},
    {"name": "University of Memphis", "slug": "memphis", "subreddits": ["r/uofmemphis"], "keywords": ["University of Memphis", "Tigers", "Memphis Tennessee"]},
    {"name": "United States Naval Academy", "slug": "navy", "subreddits": ["r/NavalAcademy"], "keywords": ["Naval Academy", "Navy Midshipmen", "Annapolis Maryland"]},
    {"name": "University of North Texas", "slug": "unt", "subreddits": ["r/unt"], "keywords": ["University of North Texas", "UNT Mean Green", "Denton Texas"]},
    {"name": "Rice University", "slug": "rice", "subreddits": ["r/rice"], "keywords": ["Rice University", "Owls", "Houston Texas"]},
    {"name": "University of South Florida", "slug": "usf", "subreddits": ["r/USF"], "keywords": ["University of South Florida", "USF Bulls", "Tampa Florida"]},
    {"name": "Temple University", "slug": "temple", "subreddits": ["r/Temple"], "keywords": ["Temple University", "Owls", "Philadelphia Pennsylvania"]},
    {"name": "University of Tulsa", "slug": "tulsa", "subreddits": ["r/utulsa"], "keywords": ["University of Tulsa", "Golden Hurricane", "Tulsa Oklahoma"]},
    {"name": "UAB", "slug": "uab", "subreddits": ["r/UAB"], "keywords": ["UAB", "University of Alabama Birmingham", "Blazers", "Birmingham Alabama"]},
    {"name": "UTSA", "slug": "utsa", "subreddits": ["r/UTSA"], "keywords": ["UTSA", "University of Texas San Antonio", "Roadrunners", "San Antonio Texas"]},
    {"name": "Wichita State", "slug": "wichitastate", "subreddits": ["r/wichitastate"], "keywords": ["Wichita State University", "Shockers", "Wichita Kansas"]},
    # Summit League
    {"name": "University of St. Thomas", "slug": "stthomas", "subreddits": ["r/uofstthomas", "r/StThomasMN"], "keywords": ["University of St. Thomas", "St. Thomas Tommies", "Minneapolis Minnesota", "UST Minnesota"]},
    # Atlantic 10
    {"name": "University of Dayton", "slug": "dayton", "subreddits": ["r/udayton"], "keywords": ["University of Dayton", "Flyers", "Dayton Ohio"]},
    {"name": "Duquesne University", "slug": "duquesne", "subreddits": ["r/Duquesne"], "keywords": ["Duquesne University", "Dukes", "Pittsburgh Pennsylvania"]},
    {"name": "Fordham University", "slug": "fordham", "subreddits": ["r/Fordham"], "keywords": ["Fordham University", "Rams", "Bronx New York"]},
    {"name": "George Mason University", "slug": "georgemason", "subreddits": ["r/gmu"], "keywords": ["George Mason University", "Patriots", "Fairfax Virginia"]},
    {"name": "George Washington University", "slug": "gwu", "subreddits": ["r/gwu"], "keywords": ["George Washington University", "GWU Colonials", "Washington DC"]},
    {"name": "La Salle University", "slug": "lasalle", "subreddits": ["r/LaSalle"], "keywords": ["La Salle University", "Explorers", "Philadelphia Pennsylvania"]},
    {"name": "Loyola University Chicago", "slug": "loyolachicago", "subreddits": ["r/LoyolaChicago"], "keywords": ["Loyola University Chicago", "Ramblers", "Chicago Illinois"]},
    {"name": "University of Rhode Island", "slug": "uri", "subreddits": ["r/URhodeIsland"], "keywords": ["University of Rhode Island", "URI Rams", "Kingston Rhode Island"]},
    {"name": "University of Richmond", "slug": "richmond", "subreddits": ["r/urichmond"], "keywords": ["University of Richmond", "Spiders", "Richmond Virginia"]},
    {"name": "Saint Louis University", "slug": "slu", "subreddits": ["r/SLU"], "keywords": ["Saint Louis University", "Billikens", "Saint Louis Missouri"]},
    {"name": "Saint Joseph's University", "slug": "sju", "subreddits": ["r/SaintJosephs"], "keywords": ["Saint Joseph's University", "Hawks", "Philadelphia Pennsylvania"]},
    {"name": "St. Bonaventure University", "slug": "stbonaventure", "subreddits": ["r/StBonaventure"], "keywords": ["St. Bonaventure University", "Bonnies", "St. Bonaventure New York"]},
    {"name": "Virginia Commonwealth University", "slug": "vcu", "subreddits": ["r/vcu"], "keywords": ["VCU", "Virginia Commonwealth University", "Rams", "Richmond Virginia"]},
]

CATEGORIES = [
    "housing", "social_life", "dining", "mental_health",
    "financial_aid", "academics", "administration", "location_and_campus",
    "career_outcomes", "value_for_money", "overall_vibe", "red_flags", "hidden_gems",
]

SYSTEM_PROMPT = (
    "You are analyzing real student opinions from multiple sources about a university. "
    "Extract honest insights students and parents would want to know but wouldn't "
    "find on an official campus tour. Be specific and direct."
)

OUTPUT_SCHEMA = """\
Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "housing": {"key_points": ["point1", "point2", "point3"], "key_quotes": ["quote1", "quote2", "quote3"], "score": 7},
  "social_life": {"key_points": [...], "key_quotes": [...], "score": 7},
  "dining": {"key_points": [...], "key_quotes": [...], "score": 7},
  "mental_health": {"key_points": [...], "key_quotes": [...], "score": 7},
  "financial_aid": {"key_points": [...], "key_quotes": [...], "score": 7},
  "academics": {"key_points": [...], "key_quotes": [...], "score": 7},
  "administration": {"key_points": [...], "key_quotes": [...], "score": 7},
  "location_and_campus": {"key_points": [...], "key_quotes": [...], "score": 7},
  "career_outcomes": {"key_points": [...], "key_quotes": [...], "score": 7},
  "value_for_money": {"key_points": [...], "key_quotes": [...], "score": 7},
  "overall_vibe": {"key_points": [...], "key_quotes": [...], "score": 7},
  "red_flags": {"key_points": [...], "key_quotes": [...], "score": 3},
  "hidden_gems": {"key_points": [...], "key_quotes": [...], "score": 7}
}
Each category must have:
- "key_points": exactly 3 short, punchy bullet points (max 12 words each), most important insight \
first, written so someone can scan the whole page in 60 seconds
- "key_quotes": 2-3 short direct quotes from the data
- "score": an integer from 1-10:
  - 1-3 = poor, consistent complaints
  - 4-5 = mixed, notable issues
  - 6-7 = good, mostly positive
  - 8-10 = excellent, strong praise
For "red_flags", the score scale is reversed (10 = very serious concerns, 1 = minimal concerns), and each \
key_point must start with a bold category keyword and a colon, e.g. \
"Housing: students assigned to inactive dorms with no notice"."""


def format_combined(items: list) -> str:
    lines = []

    reddit_items = [i for i in items if i.get("source", "reddit") == "reddit"]
    youtube_items = [i for i in items if i.get("source") == "youtube"]

    if reddit_items:
        lines.append("=== REDDIT POSTS ===")
        for idx, post in enumerate(reddit_items, 1):
            title = (post.get("title") or "").strip()
            body = (post.get("body") or "").strip()[:500]
            subreddit = post.get("subreddit", "")
            upvotes = post.get("upvotes", 0)
            lines.append(f"--- POST {idx} [{subreddit}] ({upvotes} upvotes) ---")
            lines.append(f"Title: {title}")
            if body:
                lines.append(f"Body: {body}")
            for c in (post.get("top_comments") or [])[:5]:
                text = (c.get("text") or "").strip()[:200]
                if text:
                    lines.append(f"  - {text}")
            lines.append("")

    if youtube_items:
        lines.append("=== YOUTUBE COMMENTS ===")
        for idx, item in enumerate(youtube_items, 1):
            title = (item.get("title") or "").strip()
            body = (item.get("body") or "").strip()[:500]
            upvotes = item.get("upvotes", 0)
            lines.append(f"--- COMMENT {idx} [Video: {title}] ({upvotes} likes) ---")
            lines.append(f"Text: {body}")
            lines.append("")

    return "\n".join(lines)


def strip_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        if len(parts) >= 3:
            inner = parts[1]
            if inner.startswith("json"):
                inner = inner[4:]
            return inner.strip()
    return text


def _summary_complete(path: str) -> bool:
    if not os.path.exists(path):
        return False
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return all(
            cat in data and isinstance(data[cat].get("score"), int)
            for cat in CATEGORIES
        )
    except Exception:
        return False


def summarize_school(school: dict, combined_path: str, data_dir: str) -> str:
    slug = school["slug"]
    out_path = os.path.join(data_dir, f"{slug}_summary.json")

    if _summary_complete(out_path):
        print(f"  [SKIP] {slug}_summary.json exists with all 13 categories")
        return out_path

    with open(combined_path, encoding="utf-8") as f:
        items = json.load(f)

    print(f"  → Summarizing combined data ({len(items)} total items)...")

    user_content = (
        f"You have two sources of real student data about {school['name']}: "
        f"Reddit posts (raw student opinions) and YouTube comments (reactions from tours and vlogs). "
        f"Synthesize both into honest, specific summaries. "
        f"Weight specific complaints and direct quotes heavily. Ignore generic praise.\n\n"
        f"{format_combined(items)}\n\n"
        f"{OUTPUT_SCHEMA}"
    )

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
        messages=[{
            "role": "user",
            "content": [{"type": "text", "text": user_content, "cache_control": {"type": "ephemeral"}}],
        }],
    )

    raw = strip_fences(response.content[0].text)
    usages = [response.usage]
    try:
        summary = json.loads(raw)
    except json.JSONDecodeError as e:
        # Claude occasionally emits an unescaped quote inside a key_quote (e.g. when
        # quoting source text that already contains quotation marks). Ask it to fix
        # the syntax of its own output rather than failing the whole school.
        print(f"  Malformed JSON ({e}), asking Claude to repair it...")
        repair_response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": (
                    "The following is meant to be a valid JSON object but has a syntax "
                    "error (likely an unescaped quotation mark inside a string value). "
                    "Return ONLY the corrected, valid JSON with the exact same content "
                    "— fix only the syntax, do not change any wording:\n\n" + raw
                ),
            }],
        )
        usages.append(repair_response.usage)
        raw = strip_fences(repair_response.content[0].text)
        summary = json.loads(raw)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    cost = sum(
        (usage.input_tokens or 0) * _INPUT_PRICE
        + (usage.output_tokens or 0) * _OUTPUT_PRICE
        + getattr(usage, "cache_creation_input_tokens", 0) * _CACHE_WRITE_PRICE
        + getattr(usage, "cache_read_input_tokens", 0) * _CACHE_READ_PRICE
        for usage in usages
    )
    print(f"  ✓ Done. Cost: ${cost:.2f}")
    return out_path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--school", help="Only process this school slug (e.g. kansas)")
    args = parser.parse_args()

    data_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend", "data"))
    os.makedirs(data_dir, exist_ok=True)

    schools = SCHOOLS
    if args.school:
        schools = [s for s in SCHOOLS if s["slug"] == args.school]
        if not schools:
            print(f"Unknown school slug: {args.school}")
            print(f"Available: {', '.join(s['slug'] for s in SCHOOLS)}")
            return

    total = len(schools)
    failed = []

    for i, school in enumerate(schools, 1):
        print(f"\nProcessing {school['name']} ({i}/{total})...")

        # Source 1: Reddit
        try:
            reddit_path, reddit_count = scrape_school_direct(school, data_dir)
            print(f"  ✓ Reddit: {reddit_count} posts")
        except Exception as e:
            print(f"  ✗ Reddit failed: {e}")
            failed.append((school["slug"], "reddit", str(e)))
            continue

        # Source 2: YouTube
        try:
            youtube_path, youtube_count = scrape_youtube(school, data_dir)
            print(f"  ✓ YouTube: {youtube_count} comments")
        except Exception as e:
            print(f"  ✗ YouTube failed: {e}")
            youtube_path = None

        # Merge Reddit + YouTube into combined raw
        combined: list[dict] = []

        with open(reddit_path, encoding="utf-8") as f:
            reddit_items = json.load(f)
        for item in reddit_items:
            item.setdefault("source", "reddit")
        combined.extend(reddit_items)

        if youtube_path and os.path.exists(youtube_path):
            with open(youtube_path, encoding="utf-8") as f:
                combined.extend(json.load(f))

        combined_path = os.path.join(data_dir, f"{school['slug']}_combined_raw.json")
        with open(combined_path, "w", encoding="utf-8") as f:
            json.dump(combined, f, indent=2, ensure_ascii=False)

        # Summarize
        try:
            summarize_school(school, combined_path, data_dir)
        except Exception as e:
            print(f"  ✗ Summarization failed: {e}")
            failed.append((school["slug"], "summarize", str(e)))
            continue

        if i < total:
            time.sleep(3)

    print(f"\n{'=' * 60}")
    print(f"Done. {total - len(failed)}/{total} schools completed successfully.")
    if failed:
        print("\nFailed:")
        for slug, stage, err in failed:
            print(f"  {slug} ({stage}): {err}")

    # Local import avoids a circular import (sync_school_meta imports SCHOOLS from this module).
    from sync_school_meta import sync_school_meta
    print()
    sync_school_meta()


if __name__ == "__main__":
    main()
