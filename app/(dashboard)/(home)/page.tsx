"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, XCircle, Zap } from 'lucide-react';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import StatCard from '@/components/StatCard';

export default function OverviewPage() {
  return (
    <div className="min-h-screen w-full p-4 lg:p-6 bg-background overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <StatCard name="Monthly Sales" icon={Zap} value="$12,345" color="#10B981" />
          <StatCard name="Total Customers" icon={Users} value="1,234" color="#8B5CF6" />
          <StatCard name="Failed Transactions" icon={XCircle} value="567" color="#EF4444" />
          <StatCard name="Pending Payments" icon={BarChart2} value="$512.56" color="#FBBF24" />
        </motion.div>

        {/* Chart - Now with fixed height container */}
        <div className="w-full h-[500px] sm:h-[600px]">
          <SalesOverviewChart />
        </div>
      </div>
    </div>
  );
}