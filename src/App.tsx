import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, X } from 'lucide-react';

const AgeingDebitFlow = () => {
  const [currentState, setCurrentState] = useState('t4'); // t4, t5, partial, cleared, deposit
  const [ageingDebitAmount, setAgeingDebitAmount] = useState(37481);
  const [cashBalance, setCashBalance] = useState(100000);
  const [depositAmount, setDepositAmount] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Calculate net funds based on state
  const calculateFunds = () => {
    const marginFromShares = 50000;
    const marginFromOther = 10000;
    const usedMargin = -10000;
    
    if (currentState === 'cleared') {
      return cashBalance + marginFromShares + marginFromOther + usedMargin;
    }
    
    return cashBalance + marginFromShares + marginFromOther + usedMargin - ageingDebitAmount;
  };

  const funds = calculateFunds();
  const availableMargin = funds - 10000; // For options

  const handleBannerClick = () => {
    if (currentState !== 'cleared') {
      if (!dontShowAgain) {
        setShowBottomSheet(true);
      } else {
        setDepositAmount(ageingDebitAmount.toString());
        setCurrentState('deposit');
      }
    }
  };

  const handleAddFunds = () => {
    setShowBottomSheet(false);
    setDepositAmount(ageingDebitAmount.toString());
    setCurrentState('deposit');
  };

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (amount >= ageingDebitAmount) {
      setCashBalance(cashBalance + amount);
      setCurrentState('cleared');
    } else {
      setCashBalance(cashBalance + amount);
      setAgeingDebitAmount(ageingDebitAmount - amount);
      setCurrentState('partial');
    }
    setDepositAmount('');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatLakhs = (amount) => {
    const lakhs = Math.abs(amount) / 100000;
    return lakhs.toFixed(2);
  };

  // Render Deposit Screen
  if (currentState === 'deposit') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center border-b">
          <button onClick={() => setCurrentState('t4')} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-800" strokeWidth={2} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Deposit</h1>
        </div>

        {/* Contextual Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mx-4 mt-4 mb-4">
          <p className="text-sm text-gray-800">
            <span className="font-medium">Clearing ageing debit of ₹{formatAmount(ageingDebitAmount)}</span>
          </p>
        </div>

        {/* Amount Input */}
        <div className="bg-white mx-4 p-4 rounded-lg mb-4 border border-gray-200">
          <label className="text-xs text-gray-600 mb-1 block">Enter amount here</label>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="text-2xl font-medium text-gray-900 flex-1 outline-none"
              placeholder="0"
            />
            <button 
              onClick={() => setDepositAmount('')}
              className="text-blue-600 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-3 mx-4 mb-6">
          <button
            onClick={() => setDepositAmount('1000')}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            1,000
          </button>
          <button
            onClick={() => setDepositAmount('5000')}
            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            5,000
          </button>
        </div>

        {/* Bank Account */}
        <div className="mx-4 mb-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Your bank account</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-base">H</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">HDFC Bank</p>
              <p className="text-sm text-gray-600">xxxx0293 <span className="text-green-600 font-medium">PRIMARY</span></p>
            </div>
          </div>
        </div>

        {/* Add Bank Account */}
        <div className="mx-4 mb-6">
          <button className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-800">Add bank account</span>
            <svg className="ml-auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <path d="M15 3h6v6"/>
              <path d="M10 14L21 3"/>
            </svg>
          </button>
        </div>

        {/* Payment Mode */}
        <div className="mx-4 mb-24">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Choose payment mode</h3>
          <p className="text-xs text-gray-600 mb-4">Please make the payment using the chosen bank account for a successful transaction.</p>
          
          {/* Net Banking */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Net Banking</p>
              <p className="text-xs text-gray-600">Nominal charge per transaction</p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
          </div>

          {/* UPI - Selected */}
          <div className="bg-white border-2 border-green-500 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-500 rounded flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">UPI</p>
                <p className="text-xs text-gray-600">Free of charge</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            
            {/* Google Pay */}
            <button className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path fill="#34A853" d="M12 2v20c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                  <path fill="#FBBC04" d="M12 7c-2.76 0-5 2.24-5 5h5V7z"/>
                  <path fill="#EA4335" d="M12 7v5h5c0-2.76-2.24-5-5-5z"/>
                </svg>
                <span className="text-sm font-medium text-gray-900">Google Pay</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Fixed Deposit Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || parseInt(depositAmount) <= 0}
            className="w-full bg-blue-900 text-white py-3.5 rounded-lg font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deposit {depositAmount ? new Intl.NumberFormat('en-IN').format(parseInt(depositAmount)) : ''}
          </button>
        </div>
      </div>
    );
  }

  // Render Main Funds Page
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Add CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Toggle Controls */}
      <div className="bg-blue-900 text-white p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide mb-2">Design Testing Controls</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setCurrentState('t4');
              setAgeingDebitAmount(37481);
              setCashBalance(100000);
            }}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentState === 't4' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'
            }`}
          >
            T+4 State
          </button>
          <button
            onClick={() => {
              setCurrentState('t5');
              setAgeingDebitAmount(37481);
              setCashBalance(100000);
            }}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentState === 't5' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'
            }`}
          >
            T+5 State
          </button>
          <button
            onClick={() => {
              setCurrentState('partial');
              setAgeingDebitAmount(20000);
              setCashBalance(117481);
            }}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentState === 'partial' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'
            }`}
          >
            Partial Payment
          </button>
          <button
            onClick={() => {
              setCurrentState('cleared');
              setCashBalance(137481);
            }}
            className={`px-4 py-2 rounded text-sm font-medium ${
              currentState === 'cleared' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'
            }`}
          >
            Cleared State
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between">
        <button>
          <ArrowLeft className="w-6 h-6 text-gray-800" strokeWidth={2} />
        </button>
      </div>

      {/* Ageing Debit Banner or Success Message */}
      {currentState === 't4' && (
        <div 
          onClick={handleBannerClick}
          className="mx-4 mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3.5 cursor-pointer active:bg-orange-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium leading-tight">
                Unpaid debit (Day 4) • ₹{formatAmount(ageingDebitAmount)} • Interest applying daily
              </p>
              <p className="text-xs text-gray-600 leading-tight mt-1">
                Add funds today to avoid trading limits tomorrow
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0" strokeWidth={2.5} />
          </div>
        </div>
      )}

      {currentState === 't5' && (
        <div 
          onClick={handleBannerClick}
          className="mx-4 mb-4 bg-red-50 border-2 border-red-500 rounded-xl p-4 cursor-pointer active:bg-red-100 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 leading-relaxed mb-1 font-semibold">
                Your account is on the final day to clear debit of <span className="text-red-700">₹{formatAmount(ageingDebitAmount)}</span>.
              </p>
              <p className="text-xs text-gray-800 leading-relaxed">
                Interest is being charged daily. Add funds now to avoid liquidation or trading blocks.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          </div>
        </div>
      )}

      {currentState === 'partial' && (
        <div 
          onClick={handleBannerClick}
          className="mx-4 mb-4 bg-orange-50 border border-orange-200 rounded-xl p-3.5 cursor-pointer active:bg-orange-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium leading-tight">
                Unpaid debit (Day 4) • ₹{formatAmount(ageingDebitAmount)} • Interest applying daily
              </p>
              <p className="text-xs text-gray-600 leading-tight mt-1">
                Add funds today to avoid trading limits tomorrow
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0" strokeWidth={2.5} />
          </div>
        </div>
      )}

      {currentState === 'cleared' && (
        <div className="mx-4 mb-4 bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 font-medium leading-tight">
              Ageing debit cleared | ₹37,481 added successfully
            </p>
          </div>
          <button 
            onClick={() => setCurrentState('t4')}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Funds Card */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-200 p-4">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm font-medium text-gray-700">Funds</span>
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="3">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
            </div>
            <div className={`text-3xl font-bold ${funds < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {funds < 0 && '-'}₹{formatLakhs(funds)} lakhs
            </div>
          </div>
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <defs>
                <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#60A5FA"/>
                </pattern>
              </defs>
              <rect width="56" height="56" fill="url(#dots)"/>
              <rect x="16" y="16" width="24" height="24" rx="4" fill="#EC4899"/>
            </svg>
          </div>
        </div>

        {/* Balance Details */}
        <div className="space-y-0 border-t border-gray-200 pt-3">
          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Cash balance</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${currentState !== 'cleared' && funds < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {currentState !== 'cleared' && funds < 0 ? '-' : ''}₹{formatAmount(currentState !== 'cleared' && funds < 0 ? Math.abs(funds) : cashBalance)}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </div>
          </button>

          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Margin from shares</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">₹{formatAmount(50000)}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </div>
          </button>

          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Margin from other sources</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">₹{formatAmount(10000)}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </div>
          </button>

          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Used margin</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">-₹{formatAmount(10000)}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </div>
          </button>

          <div className="w-full flex items-center justify-between py-3 bg-gray-50 -mx-4 px-4">
            <span className="text-sm font-semibold text-gray-900">Available margin</span>
            <span className="text-sm font-bold text-gray-900">₹{formatAmount(availableMargin)}</span>
          </div>

          <div className="w-full flex items-center justify-between py-3">
            <span className="text-sm text-gray-700">Available margin for buying options</span>
            <span className="text-sm font-medium text-gray-900">-₹{formatAmount(10000)}</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-0 border-t border-gray-200 pt-3 mt-3">
          <button className="w-full flex items-center gap-3 py-3 active:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="text-sm text-gray-700">Amount due details</span>
          </button>

          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              <span className="text-sm text-gray-700">View transaction history</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
          </button>

          <button className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-sm text-gray-700">Pledge for margin/unpledge</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
          </button>
        </div>

        {/* Note */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Note:</span> Deposits will reflect in your account immediately. Withdraw requests placed before 04:00 PM IST on a business day will get processed on the same day.
          </p>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-blue-900 text-white py-3.5 rounded-lg font-semibold text-sm">
            Deposit
          </button>
          <button className="flex-1 bg-blue-900 text-white py-3.5 rounded-lg font-semibold text-sm">
            Withdraw
          </button>
        </div>
      </div>

      {/* Educational Bottom Sheet */}
      {showBottomSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 animate-fadeIn">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="px-5 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-900">What is Ageing Debit?</h2>
                <button 
                  onClick={() => setShowBottomSheet(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Brief */}
              <div className="mb-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Unpaid trading dues that have been pending for {currentState === 't5' ? '5' : '4'} days.
                </p>
              </div>

              {/* Why it matters */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Why it matters</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      <span className="font-medium text-gray-900">Daily interest charges apply</span> until the debit is cleared
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      <span className="font-medium text-gray-900">Day 5 triggers square-off only mode</span> — you won't be able to place new buy orders
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      <span className="font-medium text-gray-900">Risk of forced liquidation</span> after Day 5
                    </p>
                  </div>
                </div>
              </div>

              {/* What you need to do */}
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900 mb-3">What you need to do</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Clear <span className="font-semibold text-blue-900">₹{formatAmount(ageingDebitAmount)}</span> {currentState === 't5' ? 'immediately' : 'today'} to avoid trading restrictions {currentState === 't5' ? 'and liquidation risk' : 'starting tomorrow'}.
                  </p>
                </div>
              </div>

              {/* Don't show again */}
              <button
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className="w-full flex items-center justify-center gap-2 py-3 mb-4"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  dontShowAgain ? 'bg-blue-900 border-blue-900' : 'border-gray-300'
                }`}>
                  {dontShowAgain && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">Don't show this again</span>
              </button>

              {/* Add Funds Button */}
              <button
                onClick={handleAddFunds}
                className="w-full bg-blue-900 text-white py-4 rounded-xl font-semibold text-base"
              >
                Add Funds — ₹{formatAmount(ageingDebitAmount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeingDebitFlow;
