import { FunctionDeclaration, Type } from "@google/genai";
import { EMIToolInput, EMICalculationResult } from "../types";

export const CALCULATE_EMI_TOOL_NAME = 'calculateEmi';

export const calculateEmiToolDeclaration: FunctionDeclaration = {
  name: CALCULATE_EMI_TOOL_NAME,
  description: "Calculates the monthly Equated Monthly Installment (EMI) for a loan.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      loanAmount: {
        type: Type.NUMBER,
        description: "The total principal loan amount in AED.",
      },
      annualInterestRate: {
        type: Type.NUMBER,
        description: "The annual interest rate in percentage (e.g., 4.5 for 4.5%).",
      },
      tenureYears: {
        type: Type.NUMBER,
        description: "The duration of the loan in years.",
      },
    },
    required: ["loanAmount", "annualInterestRate", "tenureYears"],
  },
};

export const executeCalculateEmi = (input: EMIToolInput): EMICalculationResult => {
  const { loanAmount, annualInterestRate, tenureYears } = input;
  
  const monthlyRate = annualInterestRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;
  
  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths);
  const denominator = Math.pow(1 + monthlyRate, numberOfMonths) - 1;
  
  const emi = numerator / denominator;
  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyEMI: parseFloat(emi.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    currency: 'AED'
  };
};