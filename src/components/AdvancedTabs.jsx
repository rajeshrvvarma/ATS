import React, { useState } from 'react';

const tabList = [
  { key: 'batches', label: 'Upcoming Batches' },
  { key: 'bootcamps', label: 'Bootcamps' },
  { key: 'workshops', label: 'Free Workshops' },
];

export default function AdvancedTabs({ children }) {
  const [activeTab, setActiveTab] = useState(tabList[0].key);

  return (
    <div className="w-full">
      <div role="tablist" className="flex justify-center gap-2 mb-6">
        {tabList.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            tabIndex={activeTab === tab.key ? 0 : -1}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-blue-500 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full">
        {children[tabList.findIndex(tab => tab.key === activeTab)]}
      </div>
    </div>
  );
}
