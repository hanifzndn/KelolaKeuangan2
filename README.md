# Dompet Keluarga - Personal Finance Manager

A personal finance management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Authentication
- User registration and login
- Profile management
- Protected routes

### Financial Management
- Account management (cash, bank, credit card, investment)
- Transaction tracking (income and expenses)
- Budget planning
- Financial reporting

### Bills Management
- Track recurring monthly bills (electricity, water, internet, etc.)
- Set due dates for each bill
- Mark bills as paid
- View upcoming bills in the dashboard

## New Bills Feature

The latest addition to the application is the **Bills Management** feature, which allows users to:

1. **Add Bills**: Create recurring bills with:
   - Bill name (e.g., "Electricity Bill")
   - Amount (in IDR)
   - Due date (day of the month)
   - Associated account
   - Category (defaults to Utilities)

2. **Manage Bills**: 
   - Edit existing bills
   - Delete bills
   - Toggle bill status (active/inactive)

3. **Pay Bills**:
   - Mark bills as paid with a single click
   - Automatically creates a transaction for the payment
   - Updates account balance accordingly

4. **Dashboard Integration**:
   - View upcoming bills in the dashboard overview
   - See bills due in the next 7 days
   - Get warnings for bills due soon (within 3 days)

## Technical Implementation

### Data Structure
- Added `Bill` interface in `lib/financeData.ts`
- Extended `FinanceContext` with bill management functions
- Added initial bills data for common utilities

### Components
- Created `/bills` page with tabbed interface
- Added "Bills" link to main navigation
- Integrated upcoming bills section in dashboard overview

### Functions
- `addBill`: Add a new bill
- `updateBill`: Update an existing bill
- `deleteBill`: Remove a bill
- `payBill`: Mark a bill as paid and create transaction
- `getUpcomingBills`: Retrieve bills due within specified days

## Usage

1. Navigate to the "Bills" section from the main navigation
2. Add your monthly bills (electricity, water, internet, etc.)
3. Set the due dates for each bill
4. Check the dashboard for upcoming bills
5. When a bill is due, click "Pay" to record the payment

## Technology Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Context API for state management
- localStorage for data persistence
