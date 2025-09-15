import React from 'react';

interface FinancialSummaryProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  icon?: React.ReactNode;
}

export default function FinancialSummary({ title, amount, type, icon }: FinancialSummaryProps) {
  const getColorClass = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'expense':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'balance':
        return amount >= 0 ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatAmount = (amount: number) => {
    return `Rp ${amount.toLocaleString()}`;
  };

  const getSign = () => {
    if (type === 'income') return '+';
    if (type === 'expense') return '-';
    return amount >= 0 ? '+' : '-';
  };

  return (
    <div className={`border rounded-lg p-4 ${getColorClass()}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold mt-1">
            {type !== 'balance' && getSign()}
            {formatAmount(Math.abs(amount))}
          </p>
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </div>
  );
}