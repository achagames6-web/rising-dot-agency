'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, ShoppingCart, Bell, ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCard {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  color: string;
  icon: string;
}

interface ChartData {
  label: string;
  value: number;
}

interface Notification {
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

interface LiveDashboardDemoProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  metrics?: MetricCard[];
  chartData?: ChartData[];
  notifications?: Notification[];
  dashboardTitle?: string;
  chartTitle?: string;
  notificationsTitle?: string;
}

const defaultMetrics: MetricCard[] = [
  { label: 'Total Revenue', value: 124500, prefix: '$', change: 12.5, color: '#37AFE1', icon: 'dollar' },
  { label: 'Active Users', value: 8420, change: 8.3, color: '#2563EB', icon: 'users' },
  { label: 'Orders Today', value: 342, change: -2.1, color: '#F97316', icon: 'cart' },
  { label: 'Growth Rate', value: 23.5, suffix: '%', change: 5.7, color: '#31A4DB', icon: 'trending' },
];

const defaultChartData: ChartData[] = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 52 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 84 },
  { label: 'Sat', value: 67 },
  { label: 'Sun', value: 95 },
];

const defaultNotifications: Notification[] = [
  { message: 'New user registered', time: '2 min ago', type: 'success' },
  { message: 'Order #1234 completed', time: '5 min ago', type: 'info' },
  { message: 'Server load at 85%', time: '10 min ago', type: 'warning' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  dollar: DollarSign,
  users: Users,
  cart: ShoppingCart,
  trending: TrendingUp,
};

export default function LiveDashboardDemo({
  eyebrow = 'Live Preview',
  title = 'See Your Dashboard',
  titleHighlight = 'In Action',
  subtitle = 'Experience a live preview of what your custom SaaS dashboard could look like.',
  metrics = defaultMetrics,
  chartData = defaultChartData,
  notifications = defaultNotifications,
  dashboardTitle = 'Analytics Dashboard',
  chartTitle = 'Weekly Performance',
  notificationsTitle = 'Recent Activity',
}: LiveDashboardDemoProps) {
  const [animatedMetrics, setAnimatedMetrics] = useState(metrics.map(m => ({ ...m, displayValue: 0 })));
  const [activeNotification, setActiveNotification] = useState(0);

  // Animate metrics on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedMetrics(metrics.map(m => ({
        ...m,
        displayValue: Math.round(m.value * progress * 100) / 100,
      })));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [metrics]);

  // Cycle notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNotification(prev => (prev + 1) % notifications.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [notifications.length]);

  const maxChartValue = Math.max(...chartData.map(d => d.value));

  return (
    <section className="py-20 px-6 bg-black/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#37AFE1] text-sm font-medium tracking-wider uppercase">
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            {title} <span className="text-[#37AFE1]">{titleHighlight}</span>
          </h2>
          <p className="text-[#94A3B8] text-lg mt-4 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Dashboard Mock */}
        <motion.div
          className="bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Dashboard Header */}
          <div className="bg-[#1E293B] px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-white font-semibold">{dashboardTitle}</h3>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative"
              >
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F97316] rounded-full" />
              </motion.div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#37AFE1] to-[#2563EB] rounded-full" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {animatedMetrics.map((metric, i) => {
              const Icon = iconMap[metric.icon] || TrendingUp;
              return (
                <motion.div
                  key={i}
                  className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{metric.label}</span>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: metric.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {metric.prefix}{metric.displayValue.toLocaleString()}{metric.suffix}
                  </div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(metric.change)}%
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chart and Notifications */}
          <div className="p-6 pt-0 grid md:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="md:col-span-2 bg-[#1E293B] rounded-xl p-4 border border-slate-700/30">
              <h4 className="text-white font-medium mb-4">{chartTitle}</h4>
              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.map((data, i) => {
                  const heightPercent = Math.max((data.value / maxChartValue) * 100, 5);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <motion.div
                        className="w-full bg-gradient-to-t from-[#37AFE1] to-[#2563EB] rounded-t min-h-[8px]"
                        initial={{ height: 8 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      />
                      <span className="text-xs text-slate-400">{data.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/30">
              <h4 className="text-white font-medium mb-4">{notificationsTitle}</h4>
              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <motion.div
                    key={i}
                    className={`p-3 rounded-lg border transition-all ${
                      i === activeNotification 
                        ? 'bg-[#0F172A] border-[#37AFE1]/50' 
                        : 'bg-transparent border-transparent'
                    }`}
                    animate={{ opacity: i === activeNotification ? 1 : 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        notif.type === 'success' ? 'bg-green-400' :
                        notif.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} />
                      <span className="text-sm text-white">{notif.message}</span>
                    </div>
                    <span className="text-xs text-slate-500 ml-4">{notif.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
