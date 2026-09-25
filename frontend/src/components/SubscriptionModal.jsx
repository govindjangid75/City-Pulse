import React, { useState } from 'react'
import { 
  SUBSCRIPTION_TIERS, 
  setActiveSubscription 
} from '../data/subscriptionPlans'
import { 
  Check, Sparkles, ShieldCheck, Zap, Building, Truck, 
  Clock, ArrowRight, ShieldAlert, X, CreditCard, ChevronRight,
  Download, Globe, Layers, BellRing, Smartphone, Award
} from 'lucide-react'

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  activeTier = 'free', 
  onSubscriptionUpdated,
  onNavigateToBusinessView
}) {
  const [isAnnual, setIsAnnual] = useState(true)
  const [selectedPlanId, setSelectedPlanId] = useState(activeTier)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  if (!isOpen) return null

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId)
  }

  const handleConfirmUpgrade = () => {
    setPaymentLoading(true)
    setTimeout(() => {
      setPaymentLoading(false)
      const updated = setActiveSubscription(selectedPlanId)
      setPaymentSuccess(true)
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated(updated)
      }
      setTimeout(() => {
        setPaymentSuccess(false)
        onClose()
      }, 1600)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 my-auto relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6 sm:mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT CIVIC TIERS • CITIZEN STANDARD TO BUSINESS PRO</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Tailored Civic Intelligence for Citizens & Businesses
          </h2>

          <p className="text-xs sm:text-sm text-slate-600">
            Every Indian resident enjoys <strong>free real-time civic detection and 24-hour SLA tracking</strong>. Upgrade for predictive AI alerts, deep historical analytics, and delivery fleet route optimization.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-bold">
            <span className={!isAnnual ? 'text-slate-900 font-extrabold' : 'text-slate-500'}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-13 h-7 bg-slate-900 rounded-full p-1 transition-colors relative flex items-center shadow-inner"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow-md ${
                  isAnnual ? 'translate-x-6 bg-emerald-400' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isAnnual ? 'text-slate-900 font-extrabold flex items-center gap-1' : 'text-slate-500'}>
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6 relative z-10">
          {/* Plan 1: Citizen Standard (Free) */}
          <div 
            onClick={() => handleSelectPlan('free')}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanId === 'free' 
                ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20' 
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider font-mono">
                  {SUBSCRIPTION_TIERS.free.name}
                </span>
                {activeTier === 'free' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    CURRENT PLAN
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">₹0</span>
                <span className="text-xs text-slate-500 font-medium"> / forever free</span>
              </div>

              <p className="text-xs text-slate-600 mb-4 font-medium">
                {SUBSCRIPTION_TIERS.free.tagline}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                {SUBSCRIPTION_TIERS.free.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSelectPlan('free')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  selectedPlanId === 'free'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {activeTier === 'free' ? 'Active Default Plan' : 'Select Free Plan'}
              </button>
            </div>
          </div>

          {/* Plan 2: Resident Sentinel Pro (Most Popular) */}
          <div 
            onClick={() => handleSelectPlan('resident_pro')}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
              selectedPlanId === 'resident_pro' 
                ? 'border-blue-600 bg-blue-50/30 shadow-lg ring-2 ring-blue-500/20' 
                : 'border-blue-200 hover:border-blue-300 bg-white'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
              MOST POPULAR FOR FAMILIES
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-2 mt-1">
                <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider font-mono">
                  {SUBSCRIPTION_TIERS.resident_pro.name}
                </span>
                {activeTier === 'resident_pro' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{isAnnual ? Math.round(SUBSCRIPTION_TIERS.resident_pro.priceAnnual / 12) : SUBSCRIPTION_TIERS.resident_pro.priceMonthly}
                </span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
                {isAnnual && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Billed annually at ₹{SUBSCRIPTION_TIERS.resident_pro.priceAnnual}/yr
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-4 font-medium">
                {SUBSCRIPTION_TIERS.resident_pro.tagline}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                {SUBSCRIPTION_TIERS.resident_pro.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSelectPlan('resident_pro')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  selectedPlanId === 'resident_pro'
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                {activeTier === 'resident_pro' ? 'Active Resident Pro' : 'Choose Resident Sentinel'}
              </button>
            </div>
          </div>

          {/* Plan 3: Commercial Logistics & Business Pro */}
          <div 
            onClick={() => handleSelectPlan('business_pro')}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlanId === 'business_pro' 
                ? 'border-purple-600 bg-purple-50/30 shadow-lg ring-2 ring-purple-500/20' 
                : 'border-purple-200 hover:border-purple-300 bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider font-mono">
                  {SUBSCRIPTION_TIERS.business_pro.name}
                </span>
                {activeTier === 'business_pro' && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="mb-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ₹{isAnnual ? Math.round(SUBSCRIPTION_TIERS.business_pro.priceAnnual / 12) : SUBSCRIPTION_TIERS.business_pro.priceMonthly}
                </span>
                <span className="text-xs text-slate-500 font-medium"> / month</span>
                {isAnnual && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Billed annually at ₹{SUBSCRIPTION_TIERS.business_pro.priceAnnual}/yr
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-4 font-medium">
                {SUBSCRIPTION_TIERS.business_pro.tagline}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                {SUBSCRIPTION_TIERS.business_pro.features.slice(0, 6).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSelectPlan('business_pro')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  selectedPlanId === 'business_pro'
                    ? 'bg-purple-600 text-white shadow-purple-500/20'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                {activeTier === 'business_pro' ? 'Active Business Pro' : 'Choose Commercial Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise Bar */}
        <div className="rounded-2xl p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 mb-6 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Municipal & Utility Enterprise Plan</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ₹24,999/mo
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Full SCADA raw feeds, NDRF/PWD response command dispatch, custom GIS boundaries & 99.99% SLA.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSelectPlan('enterprise')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Select Enterprise
          </button>
        </div>

        {/* Checkout Confirmation Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Instant UPI, Card & Corporate NetBanking Activation</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmUpgrade}
              disabled={paymentLoading || paymentSuccess}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-black transition shadow-md flex items-center gap-2"
            >
              {paymentLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Plan...</span>
                </>
              ) : paymentSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Plan Activated!</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    Confirm {SUBSCRIPTION_TIERS[selectedPlanId]?.name} Upgrade
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
