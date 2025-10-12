import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, HardDrive, Users, DollarSign, Info } from 'lucide-react';

const PricingCalculator = () => {
  const [contentGB, setContentGB] = useState(50);
  const [students, setStudents] = useState(100);
  const [months, setMonths] = useState(3);
  const [contentAccessPercentage, setContentAccessPercentage] = useState(70);
  const [cloudProvider, setCloudProvider] = useState('google');
  const [costs, setCosts] = useState({});

  // Cloud provider pricing rates (USD)
  const pricingRates = {
    google: {
      name: 'Google Cloud Storage',
      storage: 0.020, // USD per GB per month
      dataTransfer: 0.08, // USD per GB
      requests: 0.0004, // USD per 1000 requests
      color: 'blue'
    },
    aws: {
      name: 'Amazon S3 + CloudFront',
      storage: 0.023, // USD per GB per month (S3 Standard)
      dataTransfer: 0.085, // USD per GB (CloudFront)
      requests: 0.0005, // USD per 1000 requests
      color: 'orange'
    },
    azure: {
      name: 'Azure Blob Storage + CDN',
      storage: 0.018, // USD per GB per month (Hot tier)
      dataTransfer: 0.087, // USD per GB (Azure CDN)
      requests: 0.00036, // USD per 1000 requests
      color: 'cyan'
    }
  };

  const USD_TO_INR = 84; // Current exchange rate

  useEffect(() => {
    calculateCosts();
  }, [contentGB, students, months, contentAccessPercentage, cloudProvider]);

  const calculateCosts = () => {
    const rates = pricingRates[cloudProvider];
    
    // Storage costs
    const totalStorageGBMonths = contentGB * months;
    const storageCostUSD = totalStorageGBMonths * rates.storage;
    const storageCostINR = storageCostUSD * USD_TO_INR;

    // Data transfer costs
    const contentPerStudent = (contentGB * contentAccessPercentage) / 100;
    const totalDataTransferGB = students * contentPerStudent;
    const dataTransferCostUSD = totalDataTransferGB * rates.dataTransfer;
    const dataTransferCostINR = dataTransferCostUSD * USD_TO_INR;

    // Request costs (assuming 100 requests per GB accessed)
    const totalRequests = totalDataTransferGB * 100;
    const requestCostUSD = (totalRequests / 1000) * rates.requests;
    const requestCostINR = requestCostUSD * USD_TO_INR;

    // Total costs
    const totalCostUSD = storageCostUSD + dataTransferCostUSD + requestCostUSD;
    const totalCostINR = totalCostUSD * USD_TO_INR;

    // Per student cost
    const costPerStudentINR = totalCostINR / students;

    setCosts({
      storage: {
        usd: storageCostUSD,
        inr: storageCostINR
      },
      dataTransfer: {
        usd: dataTransferCostUSD,
        inr: dataTransferCostINR,
        totalGB: totalDataTransferGB
      },
      requests: {
        usd: requestCostUSD,
        inr: requestCostINR,
        count: totalRequests
      },
      total: {
        usd: totalCostUSD,
        inr: totalCostINR
      },
      perStudent: {
        inr: costPerStudentINR
      }
    });
  };

  const formatCurrency = (amount, currency = 'INR') => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(amount);
    }
  };

  const presetScenarios = [
    { name: 'Small Pilot', content: 30, students: 25, months: 3 },
    { name: 'Medium Launch', content: 50, students: 100, months: 3 },
    { name: 'Large Scale', content: 100, students: 250, months: 3 },
    { name: 'Enterprise', content: 250, students: 500, months: 3 },
    { name: 'Mega Platform', content: 500, students: 1000, months: 3 },
  ];

  // Scenario comparison data
  const scenarioMatrix = [
    { content: 30, students: [25, 50, 100, 250, 500, 1000] },
    { content: 50, students: [25, 50, 100, 250, 500, 1000] },
    { content: 100, students: [25, 50, 100, 250, 500, 1000] },
    { content: 250, students: [25, 50, 100, 250, 500, 1000] },
    { content: 500, students: [25, 50, 100, 250, 500, 1000] },
    { content: 1000, students: [25, 50, 100, 250, 500, 1000] },
  ];

  const calculateScenarioCost = (contentGB, students, months = 3, accessPercent = 70) => {
    const rates = pricingRates[cloudProvider];
    const storageCost = contentGB * months * rates.storage * USD_TO_INR;
    const dataTransferCost = students * (contentGB * accessPercent / 100) * rates.dataTransfer * USD_TO_INR;
    const requestCost = students * (contentGB * accessPercent / 100) * 100 * (rates.requests / 1000) * USD_TO_INR;
    return Math.round(storageCost + dataTransferCost + requestCost);
  };

  const applyPreset = (scenario) => {
    setContentGB(scenario.content);
    setStudents(scenario.students);
    setMonths(scenario.months);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Cloud Storage Pricing Calculator</h2>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Scenarios</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {presetScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => applyPreset(scenario)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cloud Provider
          </label>
          <select
            value={cloudProvider}
            onChange={(e) => setCloudProvider(e.target.value)}
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="google">Google Cloud</option>
            <option value="aws">Amazon AWS</option>
            <option value="azure">Microsoft Azure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Size (GB)
          </label>
          <input
            type="text"
            value={contentGB}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '' || (Number(value) >= 1 && Number(value) <= 2000)) {
                setContentGB(value === '' ? '' : Number(value));
              }
            }}
            placeholder="Enter GB"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
            min="1"
            max="2000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Students
          </label>
          <input
            type="text"
            value={students}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '' || (Number(value) >= 1 && Number(value) <= 10000)) {
                setStudents(value === '' ? '' : Number(value));
              }
            }}
            placeholder="Enter student count"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
            min="1"
            max="10000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Months)
          </label>
          <input
            type="text"
            value={months}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '' || (Number(value) >= 1 && Number(value) <= 24)) {
                setMonths(value === '' ? '' : Number(value));
              }
            }}
            placeholder="Enter months"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
            min="1"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Access (%)
          </label>
          <input
            type="text"
            value={contentAccessPercentage}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '' || (Number(value) >= 10 && Number(value) <= 100)) {
                setContentAccessPercentage(value === '' ? '' : Number(value));
              }
            }}
            placeholder="Enter percentage"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
            min="10"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">% of content each student accesses</p>
        </div>
      </div>

      {/* Results */}
      {costs.total && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Provider Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${pricingRates[cloudProvider].color}-500`}></div>
              <span className="font-medium text-gray-800">
                Pricing for: {pricingRates[cloudProvider].name}
              </span>
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(costs.total.inr)}
                </div>
                <div className="text-sm text-gray-600">Total Cost ({months} months)</div>
                <div className="text-xs text-gray-500">{formatCurrency(costs.total.usd, 'USD')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(costs.perStudent.inr)}
                </div>
                <div className="text-sm text-gray-600">Per Student Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(costs.total.inr / months)}
                </div>
                <div className="text-sm text-gray-600">Monthly Cost</div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Storage</h3>
              </div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(costs.storage.inr)}
              </div>
              <div className="text-sm text-green-600">
                {contentGB} GB × {months} months
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Data Transfer</h3>
              </div>
              <div className="text-xl font-bold text-orange-700">
                {formatCurrency(costs.dataTransfer.inr)}
              </div>
              <div className="text-sm text-orange-600">
                {Math.round(costs.dataTransfer.totalGB)} GB total
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Requests</h3>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(costs.requests.inr)}
              </div>
              <div className="text-sm text-blue-600">
                {Math.round(costs.requests.count / 1000)}K requests
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Cost Comparison Matrix (3 months)</h3>
              <p className="text-sm text-gray-600">Compare costs across different content sizes and student numbers</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Content Size</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">25 Students</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">50 Students</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">100 Students</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">250 Students</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">500 Students</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-700">1000 Students</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioMatrix.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium text-gray-900">{row.content} GB</td>
                      {row.students.map((studentCount, colIndex) => {
                        const cost = calculateScenarioCost(row.content, studentCount);
                        const isCurrentSelection = row.content === contentGB && studentCount === students;
                        return (
                          <td 
                            key={colIndex} 
                            className={`px-3 py-2 text-center cursor-pointer transition-colors ${
                              isCurrentSelection 
                                ? 'bg-blue-100 text-blue-800 font-bold' 
                                : 'text-gray-700 hover:bg-blue-50'
                            }`}
                            onClick={() => {
                              setContentGB(row.content);
                              setStudents(studentCount);
                            }}
                          >
                            ₹{cost.toLocaleString('en-IN')}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600">
              💡 Click any cell to select that configuration. Current selection is highlighted in blue.
            </div>
          </div>

          {/* Provider Comparison */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Provider Comparison (Current Configuration)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Provider</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Storage Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Data Transfer Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(pricingRates).map(([key, provider]) => {
                    // Calculate cost for this provider
                    const totalStorageGBMonths = contentGB * months;
                    const contentPerStudent = (contentGB * contentAccessPercentage) / 100;
                    const totalDataTransferGB = students * contentPerStudent;
                    const totalRequests = totalDataTransferGB * 100;
                    
                    const storageCostUSD = totalStorageGBMonths * provider.storage;
                    const dataTransferCostUSD = totalDataTransferGB * provider.dataTransfer;
                    const requestCostUSD = (totalRequests / 1000) * provider.requests;
                    const totalCostINR = (storageCostUSD + dataTransferCostUSD + requestCostUSD) * USD_TO_INR;
                    
                    return (
                      <tr key={key} className={key === cloudProvider ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${provider.color}-500`}></div>
                            <span className={`font-medium ${key === cloudProvider ? 'text-blue-800' : 'text-gray-800'}`}>
                              {provider.name}
                            </span>
                            {key === cloudProvider && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Selected</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          ${provider.storage}/GB/month
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-600">
                          ${provider.dataTransfer}/GB
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${key === cloudProvider ? 'text-blue-800' : 'text-gray-800'}`}>
                            ₹{Math.round(totalCostINR).toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Optimization Tips */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Cost Optimization Tips</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Reduce video quality to 720p can save 30-40% storage</li>
                  <li>• Implement progressive streaming to reduce data transfer</li>
                  <li>• Use compression to reduce content size by 20-50%</li>
                  <li>• Consider regional CDN if most students are in India</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PricingCalculator;