# COINED ONE - UAE Mortgage AI Assistant

A smart, empathetic AI assistant guiding users through UAE mortgage and Buy-vs-Rent decisions with zero mathematical hallucination.

---

## 🏗️ Architecture

### **Which LLM?**
**Google Gemini 2.5 Flash** (`gemini-2.5-flash`)

### **What Framework?**
**React (Vite)** + **Native `@google/genai` SDK**

### **Why?**
1.  **Speed & Cost:** Gemini 2.5 Flash offers extremely low latency, which is crucial for a real-time conversational interface.
2.  **Native Control:** We chose the raw `@google/genai` SDK over frameworks like LangChain or Vercel AI SDK.
    *   *Reason:* For a specialized agent heavily reliant on a specific tool loop (EMI Calculation), the native SDK provides cleaner control over the `functionCall` handling and message history without the overhead of heavy abstraction layers.
3.  **Client-Side Simplicity:** The app runs entirely client-side (via Vite), making deployment to Vercel instant and serverless.

---

## 🧮 The Math (Tool Call)

To strict "Zero Math Hallucination" rules, the LLM **never** calculates EMI itself. It delegates the math to a deterministic TypeScript function.

**The Logic (`tools/mortgageTools.ts`):**

```typescript
export const executeCalculateEmi = (input: EMIToolInput): EMICalculationResult => {
  const { loanAmount, annualInterestRate, tenureYears } = input;
  
  const monthlyRate = annualInterestRate / 12 / 100;
  const numberOfMonths = tenureYears * 12;
  
  // Standard EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
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
```

**The Flow:**
1.  User asks: *"What's the monthly cost for 1.5M AED over 25 years?"*
2.  LLM detects intent → Returns a `functionCall` signal.
3.  App executes `executeCalculateEmi({ loanAmount: 1500000, ... })`.
4.  App sends the JSON result back to the LLM.
5.  LLM generates the natural language response using the accurate data.

---


**Workflow:**
1.  **System Prompting:** Defined the "Hard Constraints" (80% LTV, 7% Fees) first.
2.  **Tool Definition:** Wrote the Math tool to guarantee accuracy.
3.  **Integration:** Connected the Gemini SDK to the UI.
4.  **UI Polish:** Used AI to generate the chat bubbles and typing indicators for a seamless feel.
