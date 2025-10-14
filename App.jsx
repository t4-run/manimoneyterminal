import React, { useState, useEffect } from 'react';
import { Search, Bell, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

const ManiMoneyTerminal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [priceAlert, setPriceAlert] = useState({ above: '', below: '' });
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  // Mock data for popular tickers
  const mockTickers = [
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 67234.50 },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 3421.80 },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 178.45 },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', price: 242.67 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', price: 495.32 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', price: 142.89 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', price: 415.23 },
    { symbol: 'SOL', name: 'Solana', type: 'crypto', price: 145.67 },
    { symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', price: 0.12 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', price: 178.34 }
  ];

  const mockNews = {
    'BTC': [
      { title: 'Bitcoin Surges Past $67K as Institutional Interest Grows', time: '2h ago', sentiment: 'positive' },
      { title: 'SEC Approves New Bitcoin ETF Applications', time: '4h ago', sentiment: 'positive' },
      { title: 'Analysts Predict Bitcoin Could Reach $80K by Q4', time: '6h ago', sentiment: 'positive' }
    ],
    'TSLA': [
      { title: 'Tesla Unveils New Battery Technology', time: '1h ago', sentiment: 'positive' },
      { title: 'TSLA Stock Shows Strong Momentum After Earnings', time: '3h ago', sentiment: 'positive' },
      { title: 'Production Numbers Beat Expectations', time: '5h ago', sentiment: 'positive' }
    ],
    'default': [
      { title: 'Market Shows Strong Bullish Momentum', time: '2h ago', sentiment: 'positive' },
      { title: 'Trading Volume Increases Significantly', time: '4h ago', sentiment: 'neutral' },
      { title: 'Technical Indicators Show Positive Trend', time: '5h ago', sentiment: 'positive' }
    ]
  };

  const mockTweets = {
    'BTC': [
      { user: '@CryptoWhale', text: '$BTC looking extremely bullish! Strong support at 65k 🚀', time: '45m ago' },
      { user: '@TechAnalyst', text: 'Just loaded up more $BTC. This is the dip we\'ve been waiting for', time: '1h ago' },
      { user: '@MarketInsider', text: '$BTC breaking through resistance levels. Could see 70k soon', time: '2h ago' }
    ],
    'default': [
      { user: '@MarketWatch', text: 'Strong buy signals across the board today', time: '1h ago' },
      { user: '@Investor_Pro', text: 'This is the opportunity we\'ve been looking for', time: '2h ago' },
      { user: '@TradeAlert', text: 'Volume looking great, momentum building', time: '3h ago' }
    ]
  };

  const filteredTickers = mockTickers.filter(t => 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTickerSelect = (ticker) => {
    setSelectedTicker(ticker);
    setSearchQuery('');
    setShowDropdown(false);
    setCurrentPrice(ticker.price);
  };

  const setAlert = () => {
    if (priceAlert.above || priceAlert.below) {
      const newAlert = {
        ticker: selectedTicker.symbol,
        above: priceAlert.above ? parseFloat(priceAlert.above) : null,
        below: priceAlert.below ? parseFloat(priceAlert.below) : null
      };
      setAlerts([...alerts, newAlert]);
      setPriceAlert({ above: '', below: '' });
      setShowAlertModal(false);
    }
  };

  useEffect(() => {
    if (selectedTicker) {
      const interval = setInterval(() => {
        const variation = (Math.random() - 0.5) * 10;
        setCurrentPrice(prev => parseFloat((prev + variation).toFixed(2)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedTicker]);

  useEffect(() => {
    if (selectedTicker && alerts.length > 0) {
      alerts.forEach(alert => {
        if (alert.ticker === selectedTicker.symbol) {
          if (alert.above && currentPrice >= alert.above) {
            alert(`🔔 ${selectedTicker.symbol} price is above $${alert.above}!`);
          }
          if (alert.below && currentPrice <= alert.below) {
            alert(`🔔 ${selectedTicker.symbol} price is below $${alert.below}!`);
          }
        }
      });
    }
  }, [currentPrice, alerts, selectedTicker]);

  const getAnalysisColor = (sentiment) => {
    const scores = { positive: 0.85, neutral: 0.5, negative: 0.2 };
    const score = scores[sentiment] || 0.5;
    
    if (score >= 0.7) return 'from-orange-400 to-red-500';
    if (score >= 0.5) return 'from-yellow-200 to-orange-300';
    return 'from-yellow-100 to-yellow-200';
  };

  const getAnalysisText = () => {
    if (!selectedTicker) return { text: '', color: 'from-yellow-100 to-yellow-200' };
    
    const news = mockNews[selectedTicker.symbol] || mockNews.default;
    const positiveSentiment = news.filter(n => n.sentiment === 'positive').length / news.length;
    
    if (positiveSentiment > 0.6) {
      return {
        text: `Strong buying opportunity for ${selectedTicker.symbol}. Technical indicators and recent news suggest bullish momentum with positive sentiment across social media. Risk-reward ratio favors entry at current levels.`,
        color: 'from-orange-400 to-red-500',
        recommendation: 'STRONG BUY'
      };
    } else if (positiveSentiment > 0.4) {
      return {
        text: `${selectedTicker.symbol} shows mixed signals. While there's some positive momentum, consider waiting for clearer indicators or dollar-cost averaging into position. Monitor key support levels closely.`,
        color: 'from-yellow-200 to-orange-300',
        recommendation: 'HOLD/WATCH'
      };
    }
    return {
      text: `Exercise caution with ${selectedTicker.symbol}. Current sentiment and technical indicators suggest waiting for better entry points. Consider reducing exposure or staying on sidelines until clearer trends emerge.`,
      color: 'from-yellow-100 to-yellow-200',
      recommendation: 'WAIT'
    };
  };

  const analysis = getAnalysisText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            ManiMoney Terminal
          </h1>
          <p className="text-gray-400">Real-time market intelligence & analytics</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              placeholder="Search stocks or crypto (e.g., BTC, AAPL, ETH)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          
          {showDropdown && filteredTickers.length > 0 && (
            <div className="absolute w-full mt-2 bg-slate-800 border border-purple-500/30 rounded-xl overflow-hidden z-10 shadow-2xl">
              {filteredTickers.map((ticker) => (
                <button
                  key={ticker.symbol}
                  onClick={() => handleTickerSelect(ticker)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-600/20 transition-colors border-b border-slate-700 last:border-b-0 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{ticker.symbol}</div>
                    <div className="text-sm text-gray-400">{ticker.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${ticker.price.toLocaleString()}</div>
                    <span className={`text-xs px-2 py-1 rounded ${ticker.type === 'crypto' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                      {ticker.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTicker ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedTicker.symbol}</h2>
                  <p className="text-gray-400">{selectedTicker.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">${currentPrice.toLocaleString()}</div>
                  <div className="flex items-center justify-end gap-2 text-green-400 mt-1">
                    <TrendingUp size={20} />
                    <span>+2.34%</span>
                  </div>
                </div>
              </div>

              {/* Mock Chart */}
              <div className="h-96 bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-end justify-around p-4">
                  {[...Array(20)].map((_, i) => {
                    const height = 40 + Math.random() * 60;
                    return (
                      <div
                        key={i}
                        className="w-full mx-1 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t opacity-80 hover:opacity-100 transition-all"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="relative z-10 text-gray-500 flex items-center gap-2">
                  <Clock size={20} />
                  <span>Live Price Updates</span>
                </div>
              </div>

              <button
                onClick={() => setShowAlertModal(true)}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Bell size={20} />
                Set Price Alert
              </button>
            </div>

            {/* News & Social Feed */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Latest News & Tweets</h3>
              
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-semibold text-purple-400 uppercase">News</h4>
                {(mockNews[selectedTicker.symbol] || mockNews.default).map((news, i) => (
                  <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div className="font-semibold text-white text-sm mb-1">{news.title}</div>
                    <div className="text-xs text-gray-400">{news.time}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-purple-400 uppercase">Social Feed</h4>
                {(mockTweets[selectedTicker.symbol] || mockTweets.default).map((tweet, i) => (
                  <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-purple-400" />
                      <span className="font-semibold text-sm text-purple-400">{tweet.user}</span>
                      <span className="text-xs text-gray-500">{tweet.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{tweet.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Section */}
            <div className="lg:col-span-3">
              <div className={`bg-gradient-to-r ${analysis.color} p-6 rounded-xl border-2 border-white/20 shadow-2xl`}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">AI-Powered Analysis</h3>
                  <span className="px-4 py-2 bg-white/90 rounded-full text-slate-900 font-bold text-sm shadow-lg">
                    {analysis.recommendation}
                  </span>
                </div>
                <p className="text-slate-900 text-lg leading-relaxed font-medium">
                  {analysis.text}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400">Search for a ticker to get started</h3>
            <p className="text-gray-500 mt-2">Try BTC, ETH, AAPL, or TSLA</p>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-4">Set Price Alert for {selectedTicker.symbol}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Alert when price goes above:</label>
                  <input
                    type="number"
                    value={priceAlert.above}
                    onChange={(e) => setPriceAlert({ ...priceAlert, above: e.target.value })}
                    placeholder={`Above $${currentPrice}`}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Alert when price goes below:</label>
                  <input
                    type="number"
                    value={priceAlert.below}
                    onChange={(e) => setPriceAlert({ ...priceAlert, below: e.target.value })}
                    placeholder={`Below $${currentPrice}`}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={setAlert}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Set Alert
                  </button>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManiMoneyTerminal;