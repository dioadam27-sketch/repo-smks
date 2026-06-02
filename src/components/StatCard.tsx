import React from 'react';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StatItem } from '../types';

export function StatCard({ stat }: { stat: StatItem; key?: any }) {
  const isPositive = stat.trend >= 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
        <div className="p-2 bg-slate-50 text-unair-blue rounded-lg">
          <stat.icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline">
        <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
      </div>
      <div className="mt-2 text-sm flex items-center">
        <span className={cn(
          "inline-flex items-center font-medium",
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(stat.trend)}%
        </span>
        <span className="text-slate-500 ml-2">{stat.description}</span>
      </div>
    </div>
  );
}
