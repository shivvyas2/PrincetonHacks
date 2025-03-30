require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// For Node 18+, fetch is available globally. Otherwise, install and import node-fetch.
// const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment variables (without exposing secrets)
console.log('Environment:', process.env.NODE_ENV);
console.log('KNOT_CLIENT_ID exists:', !!process.env.KNOT_CLIENT_ID);
console.log('KNOT_CLIENT_SECRET exists:', !!process.env.KNOT_CLIENT_SECRET);

// Set your Knot credentials via environment variables or replace the placeholders.
const KNOT_CLIENT_ID = process.env.KNOT_CLIENT_ID;
const KNOT_CLIENT_SECRET = process.env.KNOT_CLIENT_SECRET;

// Build the Basic Auth header
const basicAuthHeader = 'Basic ' + Buffer.from(`${KNOT_CLIENT_ID}:${KNOT_CLIENT_SECRET}`).toString('base64');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize (or create) the SQLite database
const db = new sqlite3.Database('./transactions.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transactionId TEXT,
      externalId TEXT,
      datetime TEXT,
      url TEXT,
      orderStatus TEXT,
      paymentMethods TEXT,
      price TEXT,
      products TEXT,
      merchantId TEXT,
      merchantName TEXT,
      rawData TEXT
      )`, (err) => {
        if (err) console.error("Error creating transactions table:", err.message);
      });
    }
});
//
// --- KNOT API ENDPOINTS ---
//

// Create Session Endpoint: calls Knot's Create Session API using Basic Auth.
app.get('/api/session', async (req, res) => {
  try {
    // Replace the URL with the correct Knot Create Session endpoint.
    const response = await fetch('https://development.knotapi.com/session/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuthHeader
      },
      body: JSON.stringify({
        external_user_id: "test",
        type: 'transaction_link'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Knot Create Session:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const sessionData = await response.json();
    // Expected sessionData should contain a sessionId among other details.
    res.json(sessionData);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync Transactions Endpoint: calls Knot's Sync Transactions API using Basic Auth.
app.post('/api/sync-transactions', async (req, res) => {
  try {
    const { merchantAccountId, cursor } = req.body;
    // Replace the URL with the correct Knot Sync Transactions endpoint.
    const response = await fetch('https://development.knotapi.com/transactions/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuthHeader
      },
      body: JSON.stringify({
        merchantAccountId,
        cursor // Optional: include if you support pagination/cursors.
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Knot Sync Transactions:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const syncData = await response.json();
    res.json(syncData);
  } catch (err) {
    console.error("Error syncing transactions:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//
// --- EXISTING SIMULATED ENDPOINTS ---
//

// Home page: provides navigation to the various steps.
app.get('/', (req, res) => {
    res.json({
        message: "Knot API Backend Server",
        endpoints: {
            initSdk: "/init-sdk",
            session: "/api/session",
            syncTransactions: "/api/sync-transactions",
            transactions: "/transactions",
            finance: "/finance"
        }
    });
});


// Initialize Knot SDK endpoint
app.get('/init-sdk', async (req, res) => {
  try {
    console.log('Initializing Knot SDK...');
    
    if (!KNOT_CLIENT_ID || !KNOT_CLIENT_SECRET) {
      console.error('Missing environment variables:', {
        hasClientId: !!KNOT_CLIENT_ID,
        hasClientSecret: !!KNOT_CLIENT_SECRET
      });
      throw new Error('KNOT_CLIENT_ID and KNOT_CLIENT_SECRET must be set in environment variables');
    }

    // Create a session first
    console.log('Creating Knot session...');
    const sessionResponse = await fetch('https://development.knotapi.com/session/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuthHeader
      },
      body: JSON.stringify({
        external_user_id: "test_user",
        type: 'transaction_link',
        merchant_ids: ['19'] // DoorDash merchant ID
      })
    });

    console.log('Session response status:', sessionResponse.status);
    const responseText = await sessionResponse.text();
    console.log('Session response text:', responseText);

    if (!sessionResponse.ok) {
      throw new Error(`Knot API error: ${responseText}`);
    }

    let sessionData;
    try {
      sessionData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse session response:', e);
      throw new Error('Invalid JSON response from Knot API');
    }

    console.log('Session data:', sessionData);
    
    const sessionId = sessionData.session;
    if (!sessionId) {
      console.error('Session data missing session:', sessionData);
      throw new Error('No session ID received from Knot API');
    }

    // Create the Knot SDK initialization URL
    const params = new URLSearchParams({
      client_id: KNOT_CLIENT_ID,
      session_id: sessionId,
      environment: 'development',
      product: 'transaction_link',
      merchant_ids: '19', // DoorDash merchant ID
      entry_point: 'onboarding',
      redirect_uri: 'financeapp://'
    });

    const knotUrl = `https://sdk.knotapi.com/init?${params.toString()}`;
    console.log('Generated Knot URL:', knotUrl);
    console.log('URL parameters:', Object.fromEntries(params));
    
    // Return JSON response
    res.json({ 
      url: knotUrl,
      sessionId: sessionId,
      clientId: KNOT_CLIENT_ID,
      redirectUri: 'financeapp://'
    });
  } catch (error) {
    console.error('Error initializing Knot SDK:', error);
    res.status(500).json({ 
      error: 'Failed to initialize Knot SDK',
      details: error.message 
    });
  }
});

app.post('/webhook', async (req, res) => {
    try {
      const { event, merchant, external_user_id } = req.body;
      const merchantAccountId = merchant.id;
      
      // Check if the webhook event is NEW_TRANSACTIONS_AVAILABLE.
      if (event === "NEW_TRANSACTIONS_AVAILABLE") {
        console.log("Received NEW_TRANSACTIONS_AVAILABLE webhook for merchant:", merchantAccountId);
  
        let cursor = null;
        let allTransactions = [];
  
        // Loop to handle pagination; in development you'll get 6 transactions, 1 over the limit.
        do {
          const response = await fetch('https://development.knotapi.com/transactions/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': basicAuthHeader
            },
            body: JSON.stringify({
              external_user_id,
              merchant_id: merchantAccountId,
              cursor
            })
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from Knot Sync Transactions:", errorData);
            return res.status(response.status).json({ error: errorData });
          }
  
          const syncData = await response.json();

          const transactions = syncData.transactions || [];
          cursor = syncData.next_cursor || null;
          allTransactions = allTransactions.concat(transactions);
        } while (cursor);
  
        // Insert each transaction into the database.
        for (const txn of allTransactions) {
          db.run(
            `INSERT INTO transactions (
              transactionId, externalId, datetime, url, orderStatus, paymentMethods, price, products, merchantId, merchantName, rawData
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              txn.id,
              txn.external_id || null,
              txn.datetime || null,
              txn.url || null,
              txn.order_status || null,
              JSON.stringify(txn.payment_methods || []),
              JSON.stringify(txn.price || {}),
              JSON.stringify(txn.products || []),
              JSON.stringify(txn)
            ],
            (err) => {
              if (err) console.error("Error inserting transaction:", err);
            }
          );
        }  
  
        console.log(`Synced ${allTransactions.length} transactions for merchant ${merchantAccountId}`);
        return res.json({ message: "Transactions synced", count: allTransactions.length });
      } else {
        // Handle other webhook events if needed.
        console.log("Received webhook event:", req.body);
        return res.json({ message: "Webhook received" });
      }
    } catch (err) {
      console.error("Error processing webhook:", err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// List all stored transactions (for debugging or review)
app.get('/transactions', (req, res) => {
  db.all(`SELECT * FROM transactions ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving transactions:", err.message);
      return res.status(500).send('Database error');
    }
    res.json(rows);
  });
});

// Unlink merchant account (simulate calling Knot's Unlink Merchant Account endpoint)
app.get('/unlink-merchant/:merchantId', (req, res) => {
  const merchantId = req.params.merchantId;
  res.json({ message: `Merchant account ${merchantId} unlinked successfully` });
});

app.get('/finance', (req, res) => {
    db.all(`SELECT * FROM transactions`, [], (err, rows) => {
      if (err) {
        console.error("Error retrieving transactions:", err.message);
        return res.status(500).send("Database error");
      }
      
      let totalSpent = 0;
      let totalTransactions = rows.length;
      let transactionsByStatus = {};
      
      rows.forEach(row => {
        // Count transactions by orderStatus.
        transactionsByStatus[row.orderStatus] = (transactionsByStatus[row.orderStatus] || 0) + 1;
        
        // Parse the price JSON stored in the "price" column.
        let priceData;
        try {
          priceData = JSON.parse(row.price);
        } catch (e) {
          console.error("Error parsing price data for transaction:", row.transactionId, e);
          priceData = null;
        }
        
        // Add to totalSpent if price.total is valid and if the transaction is not CANCELLED.
        if (priceData && priceData.total && row.orderStatus !== 'CANCELLED') {
          const amount = parseFloat(priceData.total);
          if (!isNaN(amount)) {
            totalSpent += amount;
          }
        }
      });
      
      const summary = {
        totalTransactions,
        totalSpent,
        transactionsByStatus,
        // Optionally, you can include the raw transactions data:
        // transactions: rows
      };
      
      res.json(summary);
    });
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
