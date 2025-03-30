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

// Pre-generated fallback recommendations to use when API is rate-limited
const fallbackRecommendations = [
  "This business perfectly aligns with your recent spending habits and could offer a fantastic new experience!",
  "Based on your recent activities, you might enjoy the unique offerings from this local establishment.",
  "This business shares values you care about, offering sustainable practices and community support.",
  "Your spending patterns suggest you'd appreciate the quality and care this business puts into their products.",
  "This local business complements your lifestyle preferences with ethically sourced goods and services.",
  "Supporting this business would contribute to community growth while providing products you'll enjoy.",
  "Your transaction history suggests this business might introduce you to new favorites you haven't tried yet."
];

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
    return applyFallbackRecommendations(businesses);
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
    
    // Try the API call with exponential backoff (max 2 retries)
    let result;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        result = await model.generateContent(prompt);
        break; // If successful, exit the loop
      } catch (error: any) {
        // Check if this is a rate limit error (429)
        if (error.toString().includes('429') && retries < maxRetries) {
          retries++;
          const delay = Math.pow(2, retries) * 1000; // Exponential backoff
          console.log(`Rate limit hit, retrying in ${delay/1000} seconds (attempt ${retries}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Either not a rate limit error or we've exhausted retries
          throw error;
        }
      }
    }
    
    // If we couldn't get a result after retries, use fallback
    if (!result) {
      console.log('Failed to get response after retries, using fallback');
      return applyFallbackRecommendations(businesses);
    }
    
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini AI');
    
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
      return applyFallbackRecommendations(businesses);
    }
  } catch (error) {
    console.error('Error generating rankings:', error);
    return applyFallbackRecommendations(businesses);
  }
}

// Helper function to apply fallback recommendations
function applyFallbackRecommendations(businesses: Business[]): RankedBusiness[] {
  return businesses.map((business, index) => ({
    ...business,
    rank: index + 1,
    reason: fallbackRecommendations[index % fallbackRecommendations.length]
  }));
}