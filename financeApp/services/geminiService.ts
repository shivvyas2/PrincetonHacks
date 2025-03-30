import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Get API key from environment variables
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Log the API key (first few characters) for debugging
console.log('Gemini API Key:', API_KEY ? `${API_KEY.substring(0, 6)}...` : 'Not set');

if (!API_KEY) {
  console.error('Gemini API key is not set. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file');
}

// Initialize Gemini AI with error handling
let genAI: GoogleGenerativeAI | undefined;
try {
  genAI = new GoogleGenerativeAI(API_KEY || '');
} catch (error) {
  console.error('Error initializing Gemini AI:', error);
}

interface TransactionInsights {
  totalSpent: number;
  favoriteItems: Array<{
    name: string;
    count: number;
    totalSpent: number;
  }>;
  favoriteCategories: Array<{
    category: string;
    count: number;
    totalSpent: number;
  }>;
  averageOrderValue: number;
}

interface Business {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
  amount: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
  category: string;
  reason?: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface RankedBusiness extends Business {
  rank: number;
}

export async function rankBusinesses(
  businesses: Business[],
  insights: TransactionInsights
): Promise<RankedBusiness[]> {
  if (!API_KEY || !genAI) {
    console.error('Gemini API not configured');
    return businesses.map((business, index) => ({
      ...business,
      rank: index + 1,
      reason: 'Default ranking based on database order'
    }));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Given these businesses and user's transaction data, rank the businesses from most relevant to least relevant and provide a positive, encouraging reason for each ranking.

    User's Transaction Data:
    - Total spent: $${insights.totalSpent}
    - Favorite items: ${insights.favoriteItems.map(item => `${item.name} (${item.count}x)`).join(', ')}
    - Favorite categories: ${insights.favoriteCategories.map(cat => `${cat.category} (${cat.count} items)`).join(', ')}
    - Average order value: $${insights.averageOrderValue}

    Businesses to rank:
    ${businesses.map((b, i) => `${i + 1}. ${b.name} (${b.category})`).join('\n')}

    For each business, provide a positive reason that:
    1. Highlights the user's interests and preferences
    2. Suggests new experiences or opportunities
    3. Emphasizes potential for growth or community impact
    4. Uses encouraging and optimistic language

    Return ONLY a JSON array with this exact structure:
    [
      {
        "businessIndex": number (0-based index of the business),
        "rank": number (1 to ${businesses.length}),
        "reason": "Positive, encouraging reason based on user's interests and preferences"
      }
    ]

    Do not include any negative language or warnings. Focus on opportunities and positive outcomes.`;

    console.log('Sending prompt to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini AI:', text);
    
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const rankings = JSON.parse(cleanText) as Array<{ businessIndex: number; rank: number; reason: string }>;
      
      // Map the rankings back to businesses
      const rankedBusinesses = rankings.map(ranking => ({
        ...businesses[ranking.businessIndex],
        rank: ranking.rank,
        reason: ranking.reason
      }));

      // Sort by rank
      return rankedBusinesses.sort((a, b) => a.rank - b.rank);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      return businesses.map((business, index) => ({
        ...business,
        rank: index + 1,
        reason: 'Default ranking based on database order'
      }));
    }
  } catch (error) {
    console.error('Error generating rankings:', error);
    return businesses.map((business, index) => ({
      ...business,
      rank: index + 1,
      reason: 'Default ranking based on database order'
    }));
  }
} 