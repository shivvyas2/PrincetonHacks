import { mockTransactionData } from '@/data/mockTransactions';
import { analyzeTransactions } from '@/services/transactionAnalysis';
import { rankBusinesses } from '@/services/geminiService';

interface Transaction {
  id: string;
  datetime: string;
  price: {
    total: number;
    currency: string;
  };
  products: Array<{
    name: string;
    description: string;
    price: {
      total: number;
    };
  }>;
}

interface Merchant {
  id: number;
  name: string;
  category: string;
}

interface BusinessRecommendation {
  name: string;
  category: string;
  description: string;
  investmentAmount: number;
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
}

interface MerchantData {
  merchant: Merchant;
  transactions: Transaction[];
}

// Mock data
const mockData: MerchantData = {
  merchant: {
    id: 19,
    name: "DoorDash",
    category: "Food Delivery"
  },
  transactions: [
    {
      id: "25257",
      datetime: "2025-02-04T17:25:02+00:00",
      price: {
        total: 24.67,
        currency: "USD"
      },
      products: [
        {
          name: "Buffalo Maitake Sandwich",
          description: "Breaded and fried mistake mushrooms tossed in buffalo sauce",
          price: {
            total: 19
          }
        }
      ]
    },
    {
      id: "25258",
      datetime: "2025-02-01T17:57:55+00:00",
      price: {
        total: 28.20,
        currency: "USD"
      },
      products: [
        {
          name: "Spicy Tuna Roll",
          description: "Fresh tuna with spicy sauce",
          price: {
            total: 22.25
          }
        }
      ]
    }
  ]
};

export const knotService = {
  async getTransactions() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTransactionData;
  },

  async getBusinessRecommendations() {
    try {
      // Analyze transaction data
      const insights = analyzeTransactions(mockTransactionData);
      
      // Generate recommendations using Gemini AI
      const recommendations = await rankBusinesses([], insights);
      
      return recommendations;
    } catch (error) {
      console.error('Error getting business recommendations:', error);
      throw error;
    }
  }
}; 