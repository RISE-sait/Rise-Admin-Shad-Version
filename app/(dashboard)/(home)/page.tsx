"use client"

import React, { useEffect }  from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart2, Users, XCircle, Zap } from 'lucide-react';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import StatCard from '@/components/StatCard';

export default function OverviewPage() {

  const router = useRouter();

  useEffect(() => {
    router.push('/calender');
  }, [router]);

  return null
}