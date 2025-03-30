import { TransactionData, Transaction, Product } from '@/data/mockTransactions';

interface SpendingInsights {
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

export function analyzeTransactions(data: TransactionData): SpendingInsights {
  const transactions = data.transactions;
  
  // Calculate total spent
  const totalSpent = transactions.reduce((sum, transaction) => 
    sum + transaction.price.total, 0);

  // Analyze favorite items
  const itemCounts = new Map<string, { count: number; totalSpent: number }>();
  
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const current = itemCounts.get(product.name) || { count: 0, totalSpent: 0 };
      itemCounts.set(product.name, {
        count: current.count + product.quantity,
        totalSpent: current.totalSpent + (product.price.total * product.quantity)
      });
    });
  });

  const favoriteItems = Array.from(itemCounts.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalSpent: data.totalSpent
    }))
    .sort((a, b) => b.count - a.count);

  // Analyze categories (based on product names and descriptions)
  const categoryCounts = new Map<string, { count: number; totalSpent: number }>();
  
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const category = determineCategory(product);
      const current = categoryCounts.get(category) || { count: 0, totalSpent: 0 };
      categoryCounts.set(category, {
        count: current.count + product.quantity,
        totalSpent: current.totalSpent + (product.price.total * product.quantity)
      });
    });
  });

  const favoriteCategories = Array.from(categoryCounts.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      totalSpent: data.totalSpent
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalSpent,
    favoriteItems,
    favoriteCategories,
    averageOrderValue: totalSpent / transactions.length
  };
}

function determineCategory(product: Product): string {
  const name = product.name.toLowerCase();
  const description = product.description?.toLowerCase() || '';

  if (name.includes('sandwich') || name.includes('roll')) {
    return 'Sandwiches & Rolls';
  } else if (name.includes('latte') || name.includes('coffee')) {
    return 'Beverages';
  } else if (name.includes('cookie') || name.includes('cake')) {
    return 'Desserts';
  } else if (name.includes('salmon') || name.includes('tuna') || name.includes('yellowtail')) {
    return 'Seafood';
  } else if (name.includes('vegetarian') || name.includes('vegan') || 
             description.includes('vegetarian') || description.includes('vegan')) {
    return 'Vegetarian';
  } else {
    return 'Other';
  }
}

export function generatePersonalizedReason(business: { category: string }, insights: SpendingInsights): string {
  const { totalSpent, favoriteItems, favoriteCategories } = insights;
  
  switch (business.category.toLowerCase()) {
    case 'cafe':
      return `Based on your $${totalSpent.toFixed(2)} in food orders, including ${favoriteItems[0].name} (${favoriteItems[0].count}x) and ${favoriteItems[1].name}`;
    case 'social':
      return `Based on your interest in sustainable food options and your frequent orders of ${favoriteCategories[0].category} (${favoriteCategories[0].count} items)`;
    case 'restaurant':
      return `Based on your spending patterns ($${totalSpent.toFixed(2)} in food orders) and preferences for ${favoriteCategories[0].category} (${favoriteCategories[0].count} items)`;
    default:
      return `Based on your spending patterns ($${totalSpent.toFixed(2)} in food orders) and preferences for ${favoriteCategories[0].category} (${favoriteCategories[0].count} items)`;
  }
} 