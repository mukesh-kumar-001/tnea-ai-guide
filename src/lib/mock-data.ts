// Mock TNEA data. In production this comes from a REST API.

export type Community = "OC" | "BC" | "BCM" | "MBC" | "SC" | "SCA" | "ST";
export const COMMUNITIES: Community[] = ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"];

export const DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
  "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Kanchipuram",
  "Kanyakumari", "Namakkal", "Dindigul", "Karur", "Sivaganga",
];

export const BRANCHES = [
  "Computer Science and Engineering",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence and Data Science",
  "Chemical Engineering",
  "Biotechnology",
  "Aeronautical Engineering",
  "Automobile Engineering",
  "Robotics and Automation",
];

export type CollegeType = "Government" | "Government Aided" | "Self-Financing" | "University Dept.";
export type NaacGrade = "A++" | "A+" | "A" | "B++" | "B+" | "B" | "Not Accredited";

export interface CutoffRow {
  year: number;
  branch: string;
  community: Community;
  cutoff: number;
}

export interface College {
  code: string;
  name: string;
  shortName: string;
  district: string;
  address: string;
  type: CollegeType;
  naac: NaacGrade;
  nba: boolean;
  established: number;
  fees: number; // annual tuition INR
  hostel: boolean;
  hostelFees?: number;
  placementPercentage: number;
  highestPackage: number; // LPA
  averagePackage: number; // LPA
  branches: string[];
  recruiters: string[];
  facilities: string[];
  scholarships: string[];
  cutoffs: CutoffRow[];
  summary: string;
}

const cutoffs = (base: number, branches: string[]): CutoffRow[] => {
  const rows: CutoffRow[] = [];
  const years = [2020, 2021, 2022, 2023, 2024];
  const comms: Community[] = ["OC", "BC", "MBC", "SC", "ST"];
  const commAdj: Record<Community, number> = { OC: 0, BC: -1.2, BCM: -2, MBC: -3, SC: -8, SCA: -10, ST: -12 };
  for (const branch of branches) {
    const bAdj = branch.includes("Computer") ? 3 : branch.includes("Information") ? 2 : branch.includes("Electronics") ? 1 : branch.includes("Artificial") ? 2.5 : 0;
    for (const year of years) {
      const yAdj = (year - 2024) * 0.4;
      for (const c of comms) {
        rows.push({
          year, branch, community: c,
          cutoff: Math.max(120, Math.min(200, +(base + bAdj + commAdj[c] + yAdj + (Math.random() * 1.2 - 0.6)).toFixed(1))),
        });
      }
    }
  }
  return rows;
};

const recruiters = ["TCS", "Infosys", "Wipro", "Zoho", "Amazon", "Microsoft", "Google", "Cognizant", "Freshworks", "L&T", "Bosch", "Ashok Leyland"];
const facilities = ["Wi-Fi Campus", "Central Library", "Sports Complex", "Innovation Lab", "Research Centre", "Auditorium", "Medical Centre", "Cafeteria"];
const scholarships = ["Merit Scholarship", "First Graduate Concession", "SC/ST Fee Waiver", "Sports Quota", "Girl Child Incentive"];

export const COLLEGES: College[] = [
  {
    code: "0001", name: "College of Engineering, Guindy (Anna University)", shortName: "CEG Anna University",
    district: "Chennai", address: "Sardar Patel Rd, Guindy, Chennai 600025",
    type: "University Dept.", naac: "A++", nba: true, established: 1794,
    fees: 55000, hostel: true, hostelFees: 40000,
    placementPercentage: 98, highestPackage: 44.5, averagePackage: 11.2,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(197, ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering"]),
    summary: "Flagship engineering college of Tamil Nadu with the oldest engineering pedigree in India. Consistent top placement records and strong research output.",
  },
  {
    code: "2006", name: "PSG College of Technology", shortName: "PSG Tech",
    district: "Coimbatore", address: "Avinashi Rd, Peelamedu, Coimbatore 641004",
    type: "Government Aided", naac: "A++", nba: true, established: 1951,
    fees: 85000, hostel: true, hostelFees: 65000,
    placementPercentage: 96, highestPackage: 41.0, averagePackage: 10.1,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Robotics and Automation", "Biotechnology"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(195, ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering"]),
    summary: "Prestigious autonomous college in Coimbatore known for industry-linked programs, strong alumni network and research culture.",
  },
  {
    code: "1315", name: "SSN College of Engineering", shortName: "SSN CE",
    district: "Kanchipuram", address: "Rajiv Gandhi Salai, Kalavakkam 603110",
    type: "Self-Financing", naac: "A+", nba: true, established: 1996,
    fees: 165000, hostel: true, hostelFees: 90000,
    placementPercentage: 95, highestPackage: 36.5, averagePackage: 8.9,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering", "Artificial Intelligence and Data Science"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(193, ["Computer Science and Engineering", "Information Technology", "Artificial Intelligence and Data Science", "Electronics and Communication Engineering"]),
    summary: "Modern residential campus with strong CS placements. Sponsored by Shiv Nadar Foundation.",
  },
  {
    code: "2007", name: "Thiagarajar College of Engineering", shortName: "TCE Madurai",
    district: "Madurai", address: "Thiruparankundram, Madurai 625015",
    type: "Government Aided", naac: "A", nba: true, established: 1957,
    fees: 65000, hostel: true, hostelFees: 45000,
    placementPercentage: 92, highestPackage: 28.0, averagePackage: 7.5,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(190, ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering"]),
    summary: "Autonomous college with strong ties to industry in southern Tamil Nadu.",
  },
  {
    code: "1128", name: "Coimbatore Institute of Technology", shortName: "CIT",
    district: "Coimbatore", address: "Civil Aerodrome Post, Coimbatore 641014",
    type: "Government Aided", naac: "A+", nba: true, established: 1956,
    fees: 60000, hostel: true, hostelFees: 42000,
    placementPercentage: 90, highestPackage: 24.0, averagePackage: 6.8,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Aeronautical Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(188, ["Computer Science and Engineering", "Aeronautical Engineering", "Electronics and Communication Engineering"]),
    summary: "Renowned government-aided institution with a legacy aeronautics program.",
  },
  {
    code: "0002", name: "Madras Institute of Technology (Anna University)", shortName: "MIT Chromepet",
    district: "Chennai", address: "Chrompet, Chennai 600044",
    type: "University Dept.", naac: "A++", nba: true, established: 1949,
    fees: 55000, hostel: true, hostelFees: 40000,
    placementPercentage: 94, highestPackage: 38.0, averagePackage: 9.5,
    branches: ["Computer Science and Engineering", "Information Technology", "Aeronautical Engineering", "Automobile Engineering", "Electronics and Communication Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(194, ["Computer Science and Engineering", "Aeronautical Engineering", "Automobile Engineering", "Information Technology"]),
    summary: "Historic Anna University department famed for aeronautical, automobile and instrumentation engineering.",
  },
  {
    code: "2701", name: "Government College of Technology", shortName: "GCT Coimbatore",
    district: "Coimbatore", address: "Thadagam Rd, Coimbatore 641013",
    type: "Government", naac: "A", nba: true, established: 1945,
    fees: 45000, hostel: true, hostelFees: 35000,
    placementPercentage: 88, highestPackage: 22.0, averagePackage: 6.2,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(189, ["Computer Science and Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"]),
    summary: "Historic government engineering college with strong academic tradition and low fees.",
  },
  {
    code: "1414", name: "Sri Sivasubramaniya Nadar College - CSE Branch", shortName: "SSN CSE Focus",
    district: "Kanchipuram", address: "Rajiv Gandhi Salai, OMR",
    type: "Self-Financing", naac: "A+", nba: true, established: 1996,
    fees: 165000, hostel: true, hostelFees: 90000,
    placementPercentage: 98, highestPackage: 44.0, averagePackage: 12.3,
    branches: ["Computer Science and Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(196, ["Computer Science and Engineering"]),
    summary: "CS-focused stream at SSN with premium placement outcomes.",
  },
  {
    code: "2008", name: "Kumaraguru College of Technology", shortName: "KCT",
    district: "Coimbatore", address: "Chinnavedampatti, Coimbatore 641049",
    type: "Self-Financing", naac: "A+", nba: true, established: 1984,
    fees: 145000, hostel: true, hostelFees: 75000,
    placementPercentage: 89, highestPackage: 26.0, averagePackage: 6.5,
    branches: ["Computer Science and Engineering", "Information Technology", "Artificial Intelligence and Data Science", "Mechanical Engineering", "Civil Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(184, ["Computer Science and Engineering", "Artificial Intelligence and Data Science", "Information Technology"]),
    summary: "Innovation-first private college with startup incubators and a strong design program.",
  },
  {
    code: "3803", name: "Mepco Schlenk Engineering College", shortName: "Mepco",
    district: "Sivaganga", address: "Mepco Engineering College Post, Sivakasi 626005",
    type: "Government Aided", naac: "A", nba: true, established: 1984,
    fees: 55000, hostel: true, hostelFees: 40000,
    placementPercentage: 85, highestPackage: 18.0, averagePackage: 5.6,
    branches: ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(180, ["Computer Science and Engineering", "Information Technology", "Electronics and Communication Engineering"]),
    summary: "Well-known aided institution in southern Tamil Nadu with steady placement record.",
  },
  {
    code: "5901", name: "Government College of Engineering, Salem", shortName: "GCE Salem",
    district: "Salem", address: "Salem 636011",
    type: "Government", naac: "A", nba: false, established: 1966,
    fees: 42000, hostel: true, hostelFees: 32000,
    placementPercentage: 78, highestPackage: 14.0, averagePackage: 4.8,
    branches: ["Computer Science and Engineering", "Electronics and Communication Engineering", "Mechanical Engineering", "Civil Engineering"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(178, ["Computer Science and Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"]),
    summary: "Affordable government college with strong core-engineering focus.",
  },
  {
    code: "2611", name: "Bannari Amman Institute of Technology", shortName: "BIT Sathy",
    district: "Erode", address: "Sathyamangalam 638401",
    type: "Self-Financing", naac: "A+", nba: true, established: 1996,
    fees: 130000, hostel: true, hostelFees: 70000,
    placementPercentage: 87, highestPackage: 22.0, averagePackage: 6.0,
    branches: ["Computer Science and Engineering", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Biotechnology"],
    recruiters, facilities, scholarships,
    cutoffs: cutoffs(182, ["Computer Science and Engineering", "Information Technology", "Biotechnology"]),
    summary: "Sprawling residential campus at the foothills of the Western Ghats.",
  },
];

export const STATS = {
  colleges: COLLEGES.length * 40, // extrapolated
  branches: BRANCHES.length,
  cutoffYears: 10,
  aiRecommendations: 125000,
};

export function findCollege(code: string): College | undefined {
  return COLLEGES.find((c) => c.code === code);
}
