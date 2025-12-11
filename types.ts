export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  isToolCall?: boolean;
  isError?: boolean;
}

export interface EMICalculationResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  currency: string;
}

export interface EMIToolInput {
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
}