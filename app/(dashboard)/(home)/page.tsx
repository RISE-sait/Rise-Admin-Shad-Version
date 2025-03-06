"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, ShoppingBag, Users, XCircle, Zap } from 'lucide-react';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import StatCard from '@/components/StatCard';

export default function OverviewPage() {
  return (

      <div className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Stats */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Monthly Sales' icon={Zap} value='$12,345' color='#10B981' />
          <StatCard name='Total Customers' icon={Users} value='1,234' color='#8B5CF6' />
          <StatCard name='Failed Transactions' icon={XCircle} value='567' color='#EF4444' />
          <StatCard name='Pending Payments' icon={BarChart2} value='$512.56' color='#FBBF24' />
        </motion.div>
        <SalesOverviewChart/>
      </div>

  )
}