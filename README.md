# Financial Management Application

A comprehensive personal finance management application built with Next.js 14, TypeScript, and Supabase.

## Features

- User authentication (Sign up, Login, Logout)
- Account management (Cash, Bank, Credit, Investment)
- Transaction tracking (Income & Expenses) with custom category support
- Budget planning
- Bill management
- Financial reporting
- Responsive design for all devices
- Progressive Web App (PWA) support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **State Management**: React Context API
- **Deployment**: Vercel

## Prerequisites

1. Node.js 18+ installed
2. Supabase account (free tier available)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd financial-management-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. In your Supabase project dashboard, go to the SQL editor
3. Copy and paste the contents of [supabase_schema.sql](supabase_schema.sql) into the editor
4. Run the SQL script to create all tables and insert default data

### 4. Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials from the project settings.

### 5. Run the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Database Schema

The application uses the following tables in Supabase:

1. **users**: Stores user information
2. **accounts**: User's financial accounts (cash, bank, credit, etc.)
3. **categories**: Transaction categories (income/expense types) - supports custom categories
4. **transactions**: Financial transactions
5. **budgets**: User-defined budgets
6. **bills**: Recurring bills and payments

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

## Custom Categories

Users can now add custom categories through the transaction recording interface:
1. Navigate to "Pencatatan Transaksi" (Transaction Recording)
2. Click the "+" button next to the category dropdown
3. Enter a name and select an icon for your new category
4. The new category will be available for selection immediately

## Row Level Security (RLS)

The application implements Row Level Security to ensure users can only access their own data. This is crucial for data privacy and security.

## Troubleshooting

### Common Issues

1. **Port conflicts**: If the application fails to start due to port conflicts, kill the processes using ports 3000-3001:
   ```bash
   # On Windows (PowerShell)
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
   Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
   ```

2. **PWA Icons**: If you see 404 errors for icons, make sure the public/icons directory contains the required PNG files. You can generate these from the public/logo.svg file.

3. **Database Connection**: If you see database connection errors:
   - Verify your Supabase URL and anon key in `.env.local`
   - Make sure you've run the SQL schema in your Supabase project
   - Check that RLS policies are properly applied

4. **UUID Errors**: If you encounter "invalid input syntax for type uuid" errors:
   - Make sure all ID fields are properly formatted as UUIDs
   - Check that you've selected valid accounts and categories when creating bills/transactions

### Development Tips

1. **Mock Data**: The application includes mock data for development when Supabase is not configured.
2. **Type Safety**: TypeScript is used throughout the application for type safety.
3. **Error Handling**: Comprehensive error handling is implemented for all database operations.

## Deployment

To deploy the application to Vercel:

1. Push your code to a GitHub repository
2. Create a new project in Vercel
3. Connect your GitHub repository
4. Set the environment variables in Vercel project settings
5. Deploy!

Make sure to add your Supabase environment variables in the Vercel project settings.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.