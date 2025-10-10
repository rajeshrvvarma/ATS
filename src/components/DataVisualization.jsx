/**
 * Data Visualization Components - Interactive charts and graphs for analytics
 * Uses Chart.js for comprehensive data visualization across the LMS
 */

import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

// Register Chart.js components
ChartJS.register(...registerables);

// Chart wrapper component with common styling
const ChartWrapper = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}>
    {title && (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

// Line Chart Component
export const LineChart = ({ 
  data, 
  title, 
  subtitle, 
  xAxisLabel = '', 
  yAxisLabel = '',
  color = '#6366f1',
  gradient = true,
  height = 300 
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Create gradient if requested
    let backgroundColor = color + '20';
    let borderColor = color;
    
    if (gradient) {
      const gradientFill = ctx.createLinearGradient(0, 0, 0, height);
      gradientFill.addColorStop(0, color + '40');
      gradientFill.addColorStop(1, color + '00');
      backgroundColor = gradientFill;
    }

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: data.labels || [],
        datasets: [{
          label: yAxisLabel || 'Value',
          data: data.values || [],
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: '#475569',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: '#94a3b8'
            },
            grid: {
              color: '#334155',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          y: {
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: '#94a3b8'
            },
            grid: {
              color: '#334155',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8'
            },
            beginAtZero: true
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBorderWidth: 3
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, color, gradient, height, xAxisLabel, yAxisLabel]);

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div style={{ height: `${height}px` }}>
        <canvas ref={chartRef} />
      </div>
    </ChartWrapper>
  );
};

// Bar Chart Component
export const BarChart = ({ 
  data, 
  title, 
  subtitle, 
  xAxisLabel = '', 
  yAxisLabel = '',
  colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  horizontal = false,
  height = 300 
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: horizontal ? 'bar' : 'bar',
      data: {
        labels: data.labels || [],
        datasets: data.datasets ? data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || colors[index % colors.length] + '80',
          borderColor: dataset.borderColor || colors[index % colors.length],
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        })) : [{
          label: yAxisLabel || 'Value',
          data: data.values || [],
          backgroundColor: colors.map((color, index) => color + '80'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: data.datasets && data.datasets.length > 1,
            labels: {
              color: '#cbd5e1',
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: '#475569',
            borderWidth: 1,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: '#94a3b8'
            },
            grid: {
              color: '#334155',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          y: {
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: '#94a3b8'
            },
            grid: {
              color: '#334155',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8'
            },
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, colors, horizontal, height, xAxisLabel, yAxisLabel]);

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div style={{ height: `${height}px` }}>
        <canvas ref={chartRef} />
      </div>
    </ChartWrapper>
  );
};

// Doughnut Chart Component
export const DoughnutChart = ({ 
  data, 
  title, 
  subtitle, 
  colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  centerText = '',
  height = 300 
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels || [],
        datasets: [{
          data: data.values || [],
          backgroundColor: colors.map(color => color + '80'),
          borderColor: colors,
          borderWidth: 2,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#cbd5e1',
              usePointStyle: true,
              padding: 20,
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    
                    return {
                      text: `${label}: ${percentage}%`,
                      fillStyle: colors[i],
                      strokeStyle: colors[i],
                      pointStyle: 'circle',
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: '#475569',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${context.raw} (${percentage}%)`;
              }
            }
          }
        }
      },
      plugins: centerText ? [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, width, height } = chart;
          ctx.restore();
          
          const fontSize = Math.min(width, height) / 10;
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const centerX = width / 2;
          const centerY = height / 2;
          ctx.fillText(centerText, centerX, centerY);
          ctx.save();
        }
      }] : []
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, colors, centerText, height]);

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div style={{ height: `${height}px` }}>
        <canvas ref={chartRef} />
      </div>
    </ChartWrapper>
  );
};

// Progress Ring Component (Custom SVG)
export const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = '#6366f1',
  backgroundColor = '#334155',
  label = '',
  value = '',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-white">
            {value || `${Math.round(percentage)}%`}
          </div>
          {label && (
            <div className="text-xs text-slate-400 text-center mt-1">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Metric Card with Mini Chart
export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend = 'up', 
  icon: Icon,
  color = 'blue',
  chartData = null,
  subtitle = ''
}) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/30' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30' }
  };

  const colorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-slate-800 rounded-lg p-6 border ${colorClass.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass.bg}`}>
          {Icon && <Icon className={`w-6 h-6 ${colorClass.text}`} />}
        </div>
        
        {change !== undefined && (
          <div className={`text-sm font-medium ${trendColors[trend]}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-white">{value}</div>
        {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
      </div>
      
      {/* Mini chart area */}
      {chartData && (
        <div className="mt-4 h-12">
          <MiniLineChart data={chartData} color={colorClass.text.replace('text-', '#')} />
        </div>
      )}
    </div>
  );
};

// Mini Line Chart for metric cards
const MiniLineChart = ({ data, color = '#6366f1' }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: data.labels || [],
        datasets: [{
          data: data.values || [],
          borderColor: color,
          backgroundColor: color + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        elements: {
          point: { radius: 0 }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, color]);

  return <canvas ref={chartRef} />;
};

// Heatmap Component (Custom implementation)
export const Heatmap = ({ 
  data, 
  title, 
  subtitle, 
  colorScale = ['#1e293b', '#3730a3', '#6366f1', '#8b5cf6', '#c084fc'],
  cellSize = 15,
  gap = 2
}) => {
  if (!data || !data.length) return null;

  const maxValue = Math.max(...data.flat().map(d => d.value || 0));
  const minValue = Math.min(...data.flat().map(d => d.value || 0));

  const getColor = (value) => {
    if (maxValue === minValue) return colorScale[0];
    const intensity = (value - minValue) / (maxValue - minValue);
    const colorIndex = Math.floor(intensity * (colorScale.length - 1));
    return colorScale[Math.min(colorIndex, colorScale.length - 1)];
  };

  return (
    <ChartWrapper title={title} subtitle={subtitle}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="rounded-sm relative group cursor-pointer"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColor(cell.value || 0)
                  }}
                  title={`${cell.label || ''}: ${cell.value || 0}`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {cell.label || 'Value'}: {cell.value || 0}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Color scale legend */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
          <span>Less</span>
          <div className="flex gap-1">
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </ChartWrapper>
  );
};

export default {
  LineChart,
  BarChart,
  DoughnutChart,
  ProgressRing,
  MetricCard,
  Heatmap
};