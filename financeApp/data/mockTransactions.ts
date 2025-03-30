export interface Price {
  sub_total: number;
  adjustments: Array<{
    type: string;
    label: string;
    amount: number;
  }>;
  total: number;
  currency: string;
}

export interface Product {
  external_id: string;
  name: string;
  description?: string;
  url: string | null;
  quantity: number;
  eligibility: string[];
  price: {
    sub_total: number;
    total: number;
    unit_price: number;
  };
}

export interface PaymentMethod {
  external_id: string;
  type: string;
  brand: string;
  last_four: string;
  name: string | null;
  transaction_amount: number;
}

export interface Transaction {
  id: string;
  external_id: string;
  datetime: string;
  url: string;
  order_status: string;
  payment_methods: PaymentMethod[];
  price: Price;
  products: Product[];
}

export interface Merchant {
  id: number;
  name: string;
}

export interface TransactionData {
  merchant: Merchant;
  transactions: Transaction[];
  next_cursor: string;
  limit: number;
}

export const mockTransactionData: TransactionData = {
  merchant: {
    id: 19,
    name: "DoorDash"
  },
  transactions: [
    {
      id: "25257",
      external_id: "755424d4-7934-44b4-b6db-f57efc828858",
      datetime: "2025-02-04T17:25:02+00:00",
      url: "https://www.doordash.com/orders/755424d4-7934-44b4-b6db-f57efc828858",
      order_status: "COMPLETED",
      payment_methods: [
        {
          external_id: "cba59554-432e-4c76-bca6-b76f8d7a2dd4",
          type: "CARD",
          brand: "AMEX",
          last_four: "1008",
          name: null,
          transaction_amount: 24.67
        }
      ],
      price: {
        sub_total: 19,
        adjustments: [
          {
            type: "FEE",
            label: "NYC Regulatory Response Fee",
            amount: 1.99
          },
          {
            type: "FEE",
            label: "Delivery Fee",
            amount: 0
          },
          {
            type: "FEE",
            label: "Service Fee",
            amount: 1.99
          },
          {
            type: "TAX",
            label: "Estimated Tax",
            amount: 1.69
          },
          {
            type: "TIP",
            label: "Dasher Tip",
            amount: 0
          }
        ],
        total: 24.67,
        currency: "USD"
      },
      products: [
        {
          external_id: "3000017887119990",
          name: "Buffalo Maitake Sandwich",
          description: "Breaded and fried mistake mushrooms tossed in buffalo sauce, with lettuce, tomato, mayonnaise, house blue cheese, and a side salad.",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 19,
            total: 19,
            unit_price: 19
          }
        }
      ]
    },
    {
      id: "25258",
      external_id: "209f279e-9d1e-422b-993d-aebaff22edda",
      datetime: "2025-02-01T17:57:55+00:00",
      url: "https://www.doordash.com/orders/209f279e-9d1e-422b-993d-aebaff22edda",
      order_status: "COMPLETED",
      payment_methods: [
        {
          external_id: "cba59554-432e-4c76-bca6-b76f8d7a2dd4",
          type: "CARD",
          brand: "AMEX",
          last_four: "1008",
          name: null,
          transaction_amount: 28.2
        }
      ],
      price: {
        sub_total: 22.25,
        adjustments: [
          {
            type: "FEE",
            label: "NYC Regulatory Response Fee",
            amount: 1.99
          },
          {
            type: "FEE",
            label: "Delivery Fee",
            amount: 0
          },
          {
            type: "FEE",
            label: "Service Fee",
            amount: 1.99
          },
          {
            type: "TAX",
            label: "Estimated Tax",
            amount: 1.97
          },
          {
            type: "TIP",
            label: "Dasher Tip",
            amount: 0
          }
        ],
        total: 28.2,
        currency: "USD"
      },
      products: [
        {
          external_id: "3000017825261862",
          name: "Salmon Sandwich",
          description: "Grilled salmon, tomato, mixed greens, salsa verde, avocado served on brioche or 7 grain choice of bread.",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 14.5,
            total: 14.5,
            unit_price: 14.5
          }
        },
        {
          external_id: "3000017825261863",
          name: "Chai Latte 12 oz",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 7.75,
            total: 7.75,
            unit_price: 7.75
          }
        }
      ]
    },
    {
      id: "25259",
      external_id: "4aa70103-b5f8-4d0d-b933-880fa3793aea",
      datetime: "2025-02-01T02:04:40+00:00",
      url: "https://www.doordash.com/orders/4aa70103-b5f8-4d0d-b933-880fa3793aea",
      order_status: "COMPLETED",
      payment_methods: [
        {
          external_id: "cba59554-432e-4c76-bca6-b76f8d7a2dd4",
          type: "CARD",
          brand: "AMEX",
          last_four: "1008",
          name: null,
          transaction_amount: 24.67
        }
      ],
      price: {
        sub_total: 19,
        adjustments: [
          {
            type: "FEE",
            label: "NYC Regulatory Response Fee",
            amount: 1.99
          },
          {
            type: "FEE",
            label: "Delivery Fee",
            amount: 0
          },
          {
            type: "FEE",
            label: "Service Fee",
            amount: 1.99
          },
          {
            type: "TAX",
            label: "Estimated Tax",
            amount: 1.69
          },
          {
            type: "TIP",
            label: "Dasher Tip",
            amount: 0
          }
        ],
        total: 24.67,
        currency: "USD"
      },
      products: [
        {
          external_id: "3000017814829492",
          name: "Buffalo Maitake Sandwich",
          description: "Breaded and fried mistake mushrooms tossed in buffalo sauce, with lettuce, tomato, mayonnaise, house blue cheese, and a side salad.",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 19,
            total: 19,
            unit_price: 19
          }
        }
      ]
    },
    {
      id: "25260",
      external_id: "8456ee19-58a3-4af6-bdd4-4a65b53cc277",
      datetime: "2025-02-01T01:03:59+00:00",
      url: "https://www.doordash.com/orders/8456ee19-58a3-4af6-bdd4-4a65b53cc277",
      order_status: "COMPLETED",
      payment_methods: [
        {
          external_id: "02765197-6f93-4d2c-8a73-f86a96aa0996",
          type: "CARD",
          brand: "VISA",
          last_four: "8095",
          name: null,
          transaction_amount: 34.9
        }
      ],
      price: {
        sub_total: 28.4,
        adjustments: [
          {
            type: "FEE",
            label: "NYC Regulatory Response Fee",
            amount: 1.99
          },
          {
            type: "FEE",
            label: "Delivery Fee",
            amount: 0
          },
          {
            type: "FEE",
            label: "Service Fee",
            amount: 1.99
          },
          {
            type: "TAX",
            label: "Estimated Tax",
            amount: 2.52
          },
          {
            type: "TIP",
            label: "Dasher Tip",
            amount: 0
          }
        ],
        total: 34.9,
        currency: "USD"
      },
      products: [
        {
          external_id: "3000017812753345",
          name: "Salmon Avocado Roll",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 8.35,
            total: 8.35,
            unit_price: 8.35
          }
        },
        {
          external_id: "3000017812753346",
          name: "Eel Avocado Roll",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 8.35,
            total: 8.35,
            unit_price: 8.35
          }
        },
        {
          external_id: "3000017812753347",
          name: "Yellowtail Belly",
          description: "Hamachi.",
          url: null,
          quantity: 2,
          eligibility: [],
          price: {
            sub_total: 11.7,
            total: 11.7,
            unit_price: 5.85
          }
        }
      ]
    },
    {
      id: "25261",
      external_id: "bc0d6f0c-3c69-43aa-83a6-b2fc0047c063",
      datetime: "2025-01-31T16:02:37+00:00",
      url: "https://www.doordash.com/orders/bc0d6f0c-3c69-43aa-83a6-b2fc0047c063",
      order_status: "COMPLETED",
      payment_methods: [
        {
          external_id: "02765197-6f93-4d2c-8a73-f86a96aa0996",
          type: "CARD",
          brand: "VISA",
          last_four: "8095",
          name: null,
          transaction_amount: 18.98
        }
      ],
      price: {
        sub_total: 15,
        adjustments: [
          {
            type: "FEE",
            label: "NYC Regulatory Response Fee",
            amount: 1.99
          },
          {
            type: "FEE",
            label: "Delivery Fee",
            amount: 0
          },
          {
            type: "FEE",
            label: "Service Fee",
            amount: 1.99
          },
          {
            type: "TAX",
            label: "Estimated Tax",
            amount: 0
          },
          {
            type: "TIP",
            label: "Dasher Tip",
            amount: 0
          }
        ],
        total: 18.98,
        currency: "USD"
      },
      products: [
        {
          external_id: "3000017798000775",
          name: "Healing Strawberry Shortcake Cookie Sandwich  (1 per order)",
          description: "Almond, cassava, coconut, maple, strawberry, avocado oil, cashew, honey,  (flax, sunflower, watermelon) seeds, extra virgin olive oil, Ceylon cinnamon, ginger, clove, nutmeg, reishi, baking powder, vanilla bean, sea salt.",
          url: null,
          quantity: 1,
          eligibility: [],
          price: {
            sub_total: 15,
            total: 15,
            unit_price: 15
          }
        }
      ]
    }
  ],
  next_cursor: "eyJpZCI6MjUyNjEsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
  limit: 5
}; 