// Generate sample finance dataset
export interface FinanceData {
  company: string;
  pe: number;
  pb: number;
  eps: number;
  volatility: number;
  debtRatio: number;
  roe: number;
  roa: number;
  oneYearReturn: number;
}

export function generateFinanceData(): FinanceData[] {
  const companies = [
    "TechCorp", "FinanceBank", "RetailCo", "EnergyPlus", "HealthCare Inc",
    "AutoMotors", "FoodChain", "MediaGroup", "RealEstate Co", "Telecom Ltd",
    "Mining Corp", "Airlines Co", "Shipping Ltd", "Pharma Inc", "Software Co",
    "Banking Corp", "Insurance Ltd", "Investment Co", "Trading Corp", "Consulting Inc",
    "Manufacturing Co", "Logistics Ltd", "Construction Co", "Hospitality Inc", "Education Corp"
  ];

  const data: FinanceData[] = [];

  for (let i = 0; i < 25; i++) {
    // Generate correlated financial metrics
    const baseValue = Math.random() * 50 + 10;
    
    data.push({
      company: companies[i],
      pe: Math.round((baseValue + Math.random() * 10 - 5) * 10) / 10,
      pb: Math.round((baseValue * 0.3 + Math.random() * 3 - 1.5) * 10) / 10,
      eps: Math.round((baseValue * 0.5 + Math.random() * 2 - 1) * 100) / 100,
      volatility: Math.round((baseValue * 0.15 + Math.random() * 5 - 2.5) * 10) / 10,
      debtRatio: Math.round((baseValue * 0.4 + Math.random() * 20 - 10) * 10) / 10,
      roe: Math.round((baseValue * 0.8 + Math.random() * 10 - 5) * 10) / 10,
      roa: Math.round((baseValue * 0.4 + Math.random() * 5 - 2.5) * 10) / 10,
      oneYearReturn: Math.round((baseValue * 0.6 + Math.random() * 15 - 7.5) * 10) / 10,
    });
  }

  return data;
}

// Extract numeric features for PCA (excluding company name)
export function extractFeatures(data: FinanceData[]): number[][] {
  return data.map(row => [
    row.pe,
    row.pb,
    row.eps,
    row.volatility,
    row.debtRatio,
    row.roe,
    row.roa,
    row.oneYearReturn,
  ]);
}

// Feature names for reference
export const featureNames = [
  "PE Ratio",
  "PB Ratio",
  "EPS",
  "Volatility",
  "Debt Ratio",
  "ROE",
  "ROA",
  "1 Year Return"
];

