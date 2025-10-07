import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';

type Signal = 'Buy' | 'Sell' | 'Neutral';

interface Currency {
  code: string;
  name: string;
  flag: string;
}

interface FundamentalData {
  gdp: { value: string; trend: Signal };
  interestRate: { value: string; trend: Signal };
  inflation: { value: string; trend: Signal };
  tradeBalance: { value: string; trend: Signal };
  unemployment: { value: string; trend: Signal };
  notes: string;
}

interface FuturesData {
  currentPrice: string;
  change: string;
  trend: Signal;
  chartUrl: string;
}

interface SentimentData {
  buyContracts: number;
  sellContracts: number;
  strength: number;
  signal: Signal;
}

interface TechnicalData {
  notes: string;
  signal: Signal;
}

interface CurrencyData {
  currency: Currency;
  fundamental: FundamentalData;
  futures: FuturesData;
  sentiment: SentimentData;
  technical: TechnicalData;
  overallSignal: Signal;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
];

const mockData: Record<string, CurrencyData> = {
  USD: {
    currency: currencies[0],
    fundamental: {
      gdp: { value: '2.8%', trend: 'Buy' },
      interestRate: { value: '5.25%', trend: 'Buy' },
      inflation: { value: '3.2%', trend: 'Neutral' },
      tradeBalance: { value: '-$68.9B', trend: 'Sell' },
      unemployment: { value: '3.7%', trend: 'Buy' },
      notes: 'Fed maintaining hawkish stance. Strong labor market supports dollar strength.',
    },
    futures: {
      currentPrice: '104.25',
      change: '+0.45%',
      trend: 'Buy',
      chartUrl: 'https://www.cnbc.com/quotes/@DX.1',
    },
    sentiment: {
      buyContracts: 45000,
      sellContracts: 32000,
      strength: 65,
      signal: 'Buy',
    },
    technical: {
      notes: 'Breaking above 104 resistance. Bullish momentum building.',
      signal: 'Buy',
    },
    overallSignal: 'Buy',
  },
  EUR: {
    currency: currencies[1],
    fundamental: {
      gdp: { value: '0.5%', trend: 'Neutral' },
      interestRate: { value: '4.00%', trend: 'Neutral' },
      inflation: { value: '2.4%', trend: 'Neutral' },
      tradeBalance: { value: '+€18.2B', trend: 'Buy' },
      unemployment: { value: '6.5%', trend: 'Neutral' },
      notes: 'ECB signaling potential pause. Economic growth remains sluggish.',
    },
    futures: {
      currentPrice: '1.0875',
      change: '-0.22%',
      trend: 'Sell',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6E',
    },
    sentiment: {
      buyContracts: 28000,
      sellContracts: 41000,
      strength: 35,
      signal: 'Sell',
    },
    technical: {
      notes: 'Testing 1.0850 support level. Bearish divergence on daily chart.',
      signal: 'Sell',
    },
    overallSignal: 'Sell',
  },
  GBP: {
    currency: currencies[2],
    fundamental: {
      gdp: { value: '0.3%', trend: 'Neutral' },
      interestRate: { value: '5.25%', trend: 'Buy' },
      inflation: { value: '4.0%', trend: 'Sell' },
      tradeBalance: { value: '-£3.1B', trend: 'Sell' },
      unemployment: { value: '4.2%', trend: 'Neutral' },
      notes: 'BoE holding rates steady. Inflation remains above target.',
    },
    futures: {
      currentPrice: '1.2645',
      change: '+0.15%',
      trend: 'Neutral',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6B',
    },
    sentiment: {
      buyContracts: 35000,
      sellContracts: 34000,
      strength: 50,
      signal: 'Neutral',
    },
    technical: {
      notes: 'Consolidating in 1.26-1.27 range. Waiting for breakout.',
      signal: 'Neutral',
    },
    overallSignal: 'Neutral',
  },
  JPY: {
    currency: currencies[3],
    fundamental: {
      gdp: { value: '1.2%', trend: 'Neutral' },
      interestRate: { value: '0.10%', trend: 'Sell' },
      inflation: { value: '2.8%', trend: 'Neutral' },
      tradeBalance: { value: '-¥1.2T', trend: 'Sell' },
      unemployment: { value: '2.5%', trend: 'Buy' },
      notes: 'BoJ maintaining ultra-loose policy. Yen remains weak vs major currencies.',
    },
    futures: {
      currentPrice: '0.00675',
      change: '-0.35%',
      trend: 'Sell',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6J',
    },
    sentiment: {
      buyContracts: 22000,
      sellContracts: 48000,
      strength: 25,
      signal: 'Sell',
    },
    technical: {
      notes: 'Downtrend continues. 148.50 next support level.',
      signal: 'Sell',
    },
    overallSignal: 'Sell',
  },
  CAD: {
    currency: currencies[4],
    fundamental: {
      gdp: { value: '1.1%', trend: 'Neutral' },
      interestRate: { value: '5.00%', trend: 'Neutral' },
      inflation: { value: '3.1%', trend: 'Neutral' },
      tradeBalance: { value: '+C$1.9B', trend: 'Buy' },
      unemployment: { value: '5.8%', trend: 'Neutral' },
      notes: 'BoC on hold. Oil prices supporting CAD.',
    },
    futures: {
      currentPrice: '0.7325',
      change: '+0.18%',
      trend: 'Buy',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6C',
    },
    sentiment: {
      buyContracts: 38000,
      sellContracts: 29000,
      strength: 60,
      signal: 'Buy',
    },
    technical: {
      notes: 'Bullish above 0.73. Oil correlation remains strong.',
      signal: 'Buy',
    },
    overallSignal: 'Buy',
  },
  AUD: {
    currency: currencies[5],
    fundamental: {
      gdp: { value: '1.8%', trend: 'Buy' },
      interestRate: { value: '4.35%', trend: 'Neutral' },
      inflation: { value: '4.1%', trend: 'Sell' },
      tradeBalance: { value: '+A$11.4B', trend: 'Buy' },
      unemployment: { value: '3.9%', trend: 'Buy' },
      notes: 'RBA hawkish. Strong commodity exports supporting AUD.',
    },
    futures: {
      currentPrice: '0.6485',
      change: '+0.28%',
      trend: 'Buy',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6A',
    },
    sentiment: {
      buyContracts: 42000,
      sellContracts: 31000,
      strength: 62,
      signal: 'Buy',
    },
    technical: {
      notes: 'Breaking 0.65 resistance. Targeting 0.66 next.',
      signal: 'Buy',
    },
    overallSignal: 'Buy',
  },
  NZD: {
    currency: currencies[6],
    fundamental: {
      gdp: { value: '0.9%', trend: 'Neutral' },
      interestRate: { value: '5.50%', trend: 'Buy' },
      inflation: { value: '4.7%', trend: 'Sell' },
      tradeBalance: { value: '-NZ$1.2B', trend: 'Sell' },
      unemployment: { value: '3.6%', trend: 'Buy' },
      notes: 'RBNZ maintaining restrictive policy. Inflation concerns persist.',
    },
    futures: {
      currentPrice: '0.5925',
      change: '+0.12%',
      trend: 'Neutral',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6N',
    },
    sentiment: {
      buyContracts: 31000,
      sellContracts: 33000,
      strength: 48,
      signal: 'Neutral',
    },
    technical: {
      notes: 'Range-bound between 0.59-0.60. Awaiting direction.',
      signal: 'Neutral',
    },
    overallSignal: 'Neutral',
  },
  CHF: {
    currency: currencies[7],
    fundamental: {
      gdp: { value: '0.7%', trend: 'Neutral' },
      interestRate: { value: '1.75%', trend: 'Neutral' },
      inflation: { value: '1.7%', trend: 'Neutral' },
      tradeBalance: { value: '+CHF4.8B', trend: 'Buy' },
      unemployment: { value: '2.1%', trend: 'Buy' },
      notes: 'SNB dovish. Safe-haven flows supporting CHF.',
    },
    futures: {
      currentPrice: '1.1345',
      change: '-0.08%',
      trend: 'Neutral',
      chartUrl: 'https://www.cmegroup.com/apps/cmegroup/widgets/productLibs/esignal-charts.html?type=p&code=6S',
    },
    sentiment: {
      buyContracts: 27000,
      sellContracts: 26000,
      strength: 51,
      signal: 'Neutral',
    },
    technical: {
      notes: 'Consolidating near 1.13. Safe-haven bid remains.',
      signal: 'Neutral',
    },
    overallSignal: 'Neutral',
  },
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function MarketDirectionTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [expandedCurrency, setExpandedCurrency] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [technicalNotes, setTechnicalNotes] = useState<Record<string, string>>(
    Object.fromEntries(currencies.map(c => [c.code, mockData[c.code].technical.notes]))
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getSignalColor = (signal: Signal) => {
    switch (signal) {
      case 'Buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const toggleExpand = (code: string) => {
    setExpandedCurrency(expandedCurrency === code ? null : code);
  };

  const handleTechnicalNoteChange = (code: string, value: string) => {
    setTechnicalNotes(prev => ({ ...prev, [code]: value }));
  };

  return (
    <div className={classNames('min-h-screen', darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900')}>
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold font-sans">Market Direction Fundamentals Tracker</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded border border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </header>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded bg-gray-200 dark:bg-gray-800 p-1">
            {['Overview', 'Fundamental', 'Futures', 'Sentiment', 'Technical'].map(tab => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-400 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow dark:bg-gray-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-white/[0.12] dark:text-gray-300'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {/* Overview Tab */}
            <Tab.Panel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {currencies.map(({ code, name, flag }) => {
                  const data = mockData[code];
                  return (
                    <div
                      key={code}
                      className={classNames(
                        'p-4 rounded-lg shadow cursor-pointer',
                        getSignalColor(data.overallSignal)
                      )}
                      onClick={() => toggleExpand(code)}
                      aria-expanded={expandedCurrency === code}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') toggleExpand(code);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-semibold">
                          {flag} {name} ({code})
                        </div>
                        <div className="text-lg font-bold">{data.overallSignal}</div>
                      </div>
                      {expandedCurrency === code && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <h3 className="font-semibold">Fundamental Notes</h3>
                            <p className="text-sm whitespace-pre-wrap">{data.fundamental.notes}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold">Technical Notes</h3>
                            <textarea
                              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                              rows={3}
                              value={technicalNotes[code]}
                              onChange={e => handleTechnicalNoteChange(code, e.target.value)}
                              placeholder="Add your technical notes here..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>

            {/* Fundamental Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                {currencies.map(({ code, name, flag }) => {
                  const data = mockData[code];
                  return (
                    <div
                      key={code}
                      className={classNames('p-4 rounded-lg shadow', getSignalColor(data.fundamental.gdp.trend))}
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {flag} {name} ({code}) - Fundamental System
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        <div>
                          <div className="font-semibold">GDP</div>
                          <div>{data.fundamental.gdp.value}</div>
                          <div className="text-sm">Signal: {data.fundamental.gdp.trend}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Interest Rate</div>
                          <div>{data.fundamental.interestRate.value}</div>
                          <div className="text-sm">Signal: {data.fundamental.interestRate.trend}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Inflation</div>
                          <div>{data.fundamental.inflation.value}</div>
                          <div className="text-sm">Signal: {data.fundamental.inflation.trend}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Trade Balance</div>
                          <div>{data.fundamental.tradeBalance.value}</div>
                          <div className="text-sm">Signal: {data.fundamental.tradeBalance.trend}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Unemployment</div>
                          <div>{data.fundamental.unemployment.value}</div>
                          <div className="text-sm">Signal: {data.fundamental.unemployment.trend}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-semibold">Notes</h3>
                        <p className="whitespace-pre-wrap">{data.fundamental.notes}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>

            {/* Futures Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                {currencies.map(({ code, name, flag }) => {
                  const data = mockData[code];
                  return (
                    <div
                      key={code}
                      className={classNames('p-4 rounded-lg shadow', getSignalColor(data.futures.trend))}
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {flag} {name} ({code}) - Futures System
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                        <div className="mb-2 sm:mb-0">
                          <div>Current Price: {data.futures.currentPrice}</div>
                          <div>Change: {data.futures.change}</div>
                          <div>Trend: {data.futures.trend}</div>
                        </div>
                        <div className="flex-1">
                          <iframe
                            src={data.futures.chartUrl}
                            title={`${code} Futures Chart`}
                            className="w-full h-48 rounded border"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="font-semibold">Label Direction:</label>
                        <select
                          className="ml-2 p-1 border rounded dark:bg-gray-800 dark:border-gray-700"
                          value={data.futures.trend}
                          onChange={e => {
                            const newTrend = e.target.value as Signal;
                            setData(prev => ({
                              ...prev,
                              [code]: {
                                ...prev[code],
                                futures: {
                                  ...prev[code].futures,
                                  trend: newTrend,
                                },
                              },
                            }));
                          }}
                        >
                          <option value="Buy">Buy</option>
                          <option value="Sell">Sell</option>
                          <option value="Neutral">Neutral</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>

            {/* Sentiment Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                {currencies.map(({ code, name, flag }) => {
                  const data = mockData[code];
                  return (
                    <div
                      key={code}
                      className={classNames('p-4 rounded-lg shadow', getSignalColor(data.sentiment.signal))}
                    >
                      <h2 className="text-xl font-semibold mb-2">
                        {flag} {name} ({code}) - Sentiment System
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <div className="font-semibold">Buy Contracts</div>
                          <div>{data.sentiment.buyContracts.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Sell Contracts</div>
                          <div>{data.sentiment.sellContracts.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Strength</div>
                          <div className="w-full bg-gray-300 rounded-full h-4 dark:bg-gray-700">
                            <div
                              className="h-4 rounded-full bg-green-500"
                              style={{ width: `${data.sentiment.strength}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>

            {/* Technical Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="mb-4">
                  <label htmlFor="currency-select" className="block font-semibold mb-1">
                    Select Currency Pair for Technical Analysis
                  </label>
                  <select
                    id="currency-select"
                    className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                    value={selectedCurrency}
                    onChange={e => setSelectedCurrency(e.target.value)}
                  >
                    {currencies.map(({ code, name }) => (
                      <option key={code} value={code}>
                        {code}/USD
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-lg shadow p-4 bg-white dark:bg-gray-800">
                  <h2 className="text-xl font-semibold mb-2">TradingView Widget - {selectedCurrency}/USD</h2>
                  <div className="tradingview-widget-container">
                    <div className="tradingview-widget-container__widget" />
                    <script
                      type="text/javascript"
                      src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
                      async
                      dangerouslySetInnerHTML={{
                        __html: `{
                          "symbol": "FX:${selectedCurrency}USD",
                          "width": 350,
                          "height": 220,
                          "locale": "en",
                          "colorTheme": "${darkMode ? 'dark' : 'light'}",
                          "isTransparent": false,
                          "autosize": false
                        }`
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="technical-notes" className="block font-semibold mb-1">
                      Technical Notes
                    </label>
                    <textarea
                      id="technical-notes"
                      rows={4}
                      className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700"
                      value={technicalNotes[selectedCurrency]}
                      onChange={e => handleTechnicalNoteChange(selectedCurrency, e.target.value)}
                      placeholder="Add your technical notes here..."
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
