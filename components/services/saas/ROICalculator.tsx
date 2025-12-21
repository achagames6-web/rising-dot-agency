'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  default: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}

interface ROICalculatorProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  sliders?: SliderConfig[];
  savingsMultiplier?: number;
  ctaText?: string;
  ctaHref?: string;
  resultLabels?: {
    currentCost: string;
    estimatedSavings: string;
    roi: string;
    paybackPeriod: string;
  };
  accentColor?: string;
}

const defaultSliders: SliderConfig[] = [
  { label: 'Manual Hours Per Week', min: 5, max: 100, default: 40, suffix: ' hrs' },
  { label: 'Hourly Employee Cost', min: 20, max: 200, default: 50, prefix: '$' },
  { label: 'Number of Employees', min: 1, max: 50, default: 5 },
];

const defaultResultLabels = {
  currentCost: 'Current Yearly Cost',
  estimatedSavings: 'Estimated Yearly Savings',
  roi: 'Return on Investment',
  paybackPeriod: 'Payback Period',
};

export default function ROICalculator({
  eyebrow = 'Calculate Your Savings',
  title = 'ROI',
  titleHighlight = 'Calculator',
  subtitle = 'See how much you could save by automating your workflows with a custom SaaS solution.',
  sliders = defaultSliders,
  savingsMultiplier = 0.7,
  ctaText = 'Get Custom Quote',
  ctaHref = '/contact',
  resultLabels = defaultResultLabels,
  accentColor = '#37AFE1',
}: ROICalculatorProps) {
  const [values, setValues] = useState<number[]>(sliders.map(s => s.default));

  const calculations = useMemo(() => {
    const [hours, hourlyRate, employees] = values;
    const weeksPerYear = 52;
    
    const currentYearlyCost = hours * hourlyRate * employees * weeksPerYear;
    const estimatedSavings = currentYearlyCost * savingsMultiplier;
    const implementationCost = 25000; // Assumed average project cost
    const roi = ((estimatedSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = Math.ceil((implementationCost / (estimatedSavings / 12)));

    return {
      currentYearlyCost,
      estimatedSavings,
      roi: Math.max(roi, 0),
      paybackMonths: Math.min(paybackMonths, 24),
    };
  }, [values, savingsMultiplier]);

  const handleSliderChange = (index: number, value: number) => {
    setValues(prev => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <section className="py-20 px-6 bg-black/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium tracking-wider uppercase" style={{ color: accentColor }}>
            {eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            {title} <span style={{ color: accentColor }}>{titleHighlight}</span>
          </h2>
          <p className="text-[#94A3B8] text-lg mt-4 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sliders */}
          <motion.div
            className="bg-[#1E293B] rounded-2xl p-8 border border-slate-700/50"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
                <Calculator className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <h3 className="text-xl font-bold text-white">Your Current Situation</h3>
            </div>

            <div className="space-y-8">
              {sliders.map((slider, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <label className="text-slate-300 font-medium">{slider.label}</label>
                    <span className="text-white font-bold">
                      {slider.prefix}{values[i]}{slider.suffix}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step || 1}
                    value={values[i]}
                    onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#37AFE1]"
                    style={{ accentColor }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{slider.prefix}{slider.min}{slider.suffix}</span>
                    <span>{slider.prefix}{slider.max}{slider.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            className="bg-[#1E293B] rounded-2xl p-8 border border-slate-700/50"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
                <TrendingUp className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <h3 className="text-xl font-bold text-white">Your Potential Savings</h3>
            </div>

            <div className="space-y-6">
              {/* Current Cost */}
              <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{resultLabels.currentCost}</span>
                </div>
                <motion.div
                  className="text-3xl font-bold text-white"
                  key={calculations.currentYearlyCost}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  ${calculations.currentYearlyCost.toLocaleString()}
                </motion.div>
              </div>

              {/* Estimated Savings */}
              <div className="p-4 rounded-xl border-2" style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}50` }}>
                <div className="flex items-center gap-2 mb-1" style={{ color: accentColor }}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{resultLabels.estimatedSavings}</span>
                </div>
                <motion.div
                  className="text-4xl font-bold"
                  style={{ color: accentColor }}
                  key={calculations.estimatedSavings}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  ${calculations.estimatedSavings.toLocaleString()}
                </motion.div>
              </div>

              {/* ROI and Payback */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-700/30">
                  <span className="text-slate-400 text-sm">{resultLabels.roi}</span>
                  <div className="text-2xl font-bold text-green-400">
                    {calculations.roi.toFixed(0)}%
                  </div>
                </div>
                <div className="p-4 bg-[#0F172A] rounded-xl border border-slate-700/30">
                  <span className="text-slate-400 text-sm">{resultLabels.paybackPeriod}</span>
                  <div className="text-2xl font-bold text-white flex items-center gap-1">
                    <Clock className="w-5 h-5 text-slate-400" />
                    {calculations.paybackMonths} mo
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={ctaHref}
                className="block w-full py-4 text-center text-white font-semibold rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
