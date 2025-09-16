# Supabase Setup Guide

This guide explains how to set up your Supabase database for the Financial Management Application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project

## Database Setup

1. In your Supabase project dashboard, go to the SQL editor
2. Copy and paste the contents of [supabase_schema.sql](supabase_schema.sql) into the editor
3. Run the SQL script to create all tables and insert default data

## Configuration

After setting up the database, you'll need to configure your application:

1. Get your Supabase URL and API key from the project settings
2. Create a `.env.local` file in your project root with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase credentials.

## Row Level Security (RLS)

The SQL schema includes Row Level Security policies that ensure users can only access their own data. This is crucial for data privacy and security.

## Tables Overview

- **users**: Stores user information
- **accounts**: User's financial accounts (cash, bank, credit, etc.)
- **categories**: Transaction categories (income/expense types)
- **transactions**: Financial transactions
- **budgets**: User-defined budgets
- **bills**: Recurring bills and payments

## Default Categories

The schema automatically inserts 8 default categories:
1. Salary (income)
2. Freelance (income)
3. Food & Dining (expense)
4. Transportation (expense)
5. Shopping (expense)
6. Entertainment (expense)
7. Utilities (expense)
8. Health (expense)

These can be modified or extended through the application interface.

## Troubleshooting

If you encounter any issues:

1. Make sure all environment variables are correctly set
2. Verify that your Supabase project URL and API key are correct
3. Check that the RLS policies are properly applied
4. Ensure that the UUID extension is enabled in your Supabase project

For any database-related errors, check the browser console and Supabase logs for detailed error messages.