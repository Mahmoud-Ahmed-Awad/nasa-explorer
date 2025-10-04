import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ArcElement,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";
import {
  Scatter,
  Bar,
  Line,
  Doughnut,
  Radar,
  PolarArea,
} from "react-chartjs-2";
import "chartjs-adapter-date-fns";

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  ArcElement,
  TimeScale,
  TimeSeriesScale
);

const AdvancedDataVisualization = ({
  data,
  type = "multi-chart",
  theme = "dark",
  enableAnimations = true,
  enableInteractions = true,
  className = "",
}) => {
  const [activeChart, setActiveChart] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Process data for different chart types
  const processedData = useMemo(() => {
    if (!data) return null;

    const processed = {
      exoplanets: data.exoplanets || [],
      missions: data.missions || [],
      satellites: data.satellites || [],
    };

    // Exoplanet analysis
    const exoplanetAnalysis = {
      massDistribution: {},
      radiusDistribution: {},
      distanceDistribution: {},
      temperatureDistribution: {},
      habitableCount: 0,
      typeDistribution: {},
    };

    processed.exoplanets.forEach((planet) => {
      // Mass distribution
      const massRange = Math.floor(planet.mass / 5) * 5;
      exoplanetAnalysis.massDistribution[massRange] =
        (exoplanetAnalysis.massDistribution[massRange] || 0) + 1;

      // Radius distribution
      const radiusRange = Math.floor(planet.radius / 2) * 2;
      exoplanetAnalysis.radiusDistribution[radiusRange] =
        (exoplanetAnalysis.radiusDistribution[radiusRange] || 0) + 1;

      // Distance distribution
      const distanceRange = Math.floor(planet.distance / 100) * 100;
      exoplanetAnalysis.distanceDistribution[distanceRange] =
        (exoplanetAnalysis.distanceDistribution[distanceRange] || 0) + 1;

      // Temperature distribution
      const tempRange = Math.floor(planet.temperature / 200) * 200;
      exoplanetAnalysis.temperatureDistribution[tempRange] =
        (exoplanetAnalysis.temperatureDistribution[tempRange] || 0) + 1;

      // Habitable count
      if (planet.habitable) exoplanetAnalysis.habitableCount++;

      // Type distribution
      exoplanetAnalysis.typeDistribution[planet.type] =
        (exoplanetAnalysis.typeDistribution[planet.type] || 0) + 1;
    });

    // Mission analysis
    const missionAnalysis = {
      yearDistribution: {},
      statusDistribution: {},
      typeDistribution: {},
      costAnalysis: [],
      durationAnalysis: [],
    };

    processed.missions.forEach((mission) => {
      // Year distribution
      missionAnalysis.yearDistribution[mission.launchYear] =
        (missionAnalysis.yearDistribution[mission.launchYear] || 0) + 1;

      // Status distribution
      missionAnalysis.statusDistribution[mission.status] =
        (missionAnalysis.statusDistribution[mission.status] || 0) + 1;

      // Type distribution
      missionAnalysis.typeDistribution[mission.type] =
        (missionAnalysis.typeDistribution[mission.type] || 0) + 1;

      // Cost analysis (extract numeric value)
      const costValue = parseFloat(mission.cost?.replace(/[^0-9.]/g, "")) || 0;
      if (costValue > 0) {
        missionAnalysis.costAnalysis.push({
          name: mission.name,
          cost: costValue,
          year: mission.launchYear,
        });
      }
    });

    // Satellite analysis
    const satelliteAnalysis = {
      altitudeDistribution: {},
      countryDistribution: {},
      typeDistribution: {},
      statusDistribution: {},
      orbitalPeriodAnalysis: [],
    };

    processed.satellites.forEach((satellite) => {
      // Altitude distribution
      const altRange = Math.floor(satellite.altitude / 500) * 500;
      satelliteAnalysis.altitudeDistribution[altRange] =
        (satelliteAnalysis.altitudeDistribution[altRange] || 0) + 1;

      // Country distribution
      satelliteAnalysis.countryDistribution[satellite.country] =
        (satelliteAnalysis.countryDistribution[satellite.country] || 0) + 1;

      // Type distribution
      satelliteAnalysis.typeDistribution[satellite.type] =
        (satelliteAnalysis.typeDistribution[satellite.type] || 0) + 1;

      // Status distribution
      satelliteAnalysis.statusDistribution[satellite.status] =
        (satelliteAnalysis.statusDistribution[satellite.status] || 0) + 1;

      // Orbital period analysis
      satelliteAnalysis.orbitalPeriodAnalysis.push({
        name: satellite.name,
        period: satellite.period,
        altitude: satellite.altitude,
        type: satellite.type,
      });
    });

    return {
      exoplanetAnalysis,
      missionAnalysis,
      satelliteAnalysis,
      raw: processed,
    };
  }, [data]);

  // Chart configurations
  const chartConfigs = useMemo(() => {
    if (!processedData) return null;

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme === "dark" ? "#e2e8f0" : "#374151",
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          titleColor: theme === "dark" ? "#ffffff" : "#000000",
          bodyColor: theme === "dark" ? "#e2e8f0" : "#374151",
          borderColor: theme === "dark" ? "#3b82f6" : "#6b7280",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#94a3b8" : "#6b7280",
          },
          grid: {
            color:
              theme === "dark"
                ? "rgba(148, 163, 184, 0.1)"
                : "rgba(107, 114, 128, 0.1)",
          },
        },
        y: {
          ticks: {
            color: theme === "dark" ? "#94a3b8" : "#6b7280",
          },
          grid: {
            color:
              theme === "dark"
                ? "rgba(148, 163, 184, 0.1)"
                : "rgba(107, 114, 128, 0.1)",
          },
        },
      },
      animation: enableAnimations
        ? {
            duration: 2000,
            easing: "easeInOutQuart",
          }
        : false,
    };

    return {
      // Exoplanet Mass vs Radius Scatter
      exoplanetScatter: {
        data: {
          datasets: [
            {
              label: "Exoplanets",
              data: processedData.raw.exoplanets.map((planet) => ({
                x: planet.mass,
                y: planet.radius,
                label: planet.name,
                habitable: planet.habitable,
                type: planet.type,
              })),
              backgroundColor: (context) => {
                const habitable = context.raw.habitable;
                return habitable
                  ? "rgba(34, 197, 94, 0.6)"
                  : "rgba(59, 130, 246, 0.6)";
              },
              borderColor: (context) => {
                const habitable = context.raw.habitable;
                return habitable
                  ? "rgba(34, 197, 94, 1)"
                  : "rgba(59, 130, 246, 1)";
              },
              borderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            title: {
              display: true,
              text: "Exoplanet Mass vs Radius Distribution",
              color: theme === "dark" ? "#ffffff" : "#000000",
              font: {
                size: 16,
                weight: "bold",
              },
            },
            tooltip: {
              ...baseOptions.plugins.tooltip,
              callbacks: {
                title: (context) => context[0].raw.label,
                label: (context) => [
                  `Mass: ${context.parsed.x} Earth masses`,
                  `Radius: ${context.parsed.y} Earth radii`,
                  `Type: ${context.raw.type}`,
                  `Habitable: ${context.raw.habitable ? "Yes" : "No"}`,
                ],
              },
            },
          },
          scales: {
            x: {
              ...baseOptions.scales.x,
              title: {
                display: true,
                text: "Mass (Earth masses)",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y: {
              ...baseOptions.scales.y,
              title: {
                display: true,
                text: "Radius (Earth radii)",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          },
        },
      },

      // Mission Cost Over Time
      missionCost: {
        data: {
          labels: processedData.missionAnalysis.costAnalysis
            .map((m) => m.year)
            .sort(),
          datasets: [
            {
              label: "Mission Cost (Billions USD)",
              data: processedData.missionAnalysis.costAnalysis
                .sort((a, b) => a.year - b.year)
                .map((m) => m.cost),
              backgroundColor: "rgba(59, 130, 246, 0.6)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            title: {
              display: true,
              text: "NASA Mission Costs Over Time",
              color: theme === "dark" ? "#ffffff" : "#000000",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          scales: {
            x: {
              ...baseOptions.scales.x,
              title: {
                display: true,
                text: "Launch Year",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y: {
              ...baseOptions.scales.y,
              title: {
                display: true,
                text: "Cost (Billions USD)",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          },
        },
      },

      // Satellite Altitude Distribution
      satelliteAltitude: {
        data: {
          labels: Object.keys(
            processedData.satelliteAnalysis.altitudeDistribution
          ).map((alt) => `${alt}-${parseInt(alt) + 500} km`),
          datasets: [
            {
              label: "Number of Satellites",
              data: Object.values(
                processedData.satelliteAnalysis.altitudeDistribution
              ),
              backgroundColor: [
                "rgba(239, 68, 68, 0.6)",
                "rgba(245, 158, 11, 0.6)",
                "rgba(34, 197, 94, 0.6)",
                "rgba(59, 130, 246, 0.6)",
                "rgba(147, 51, 234, 0.6)",
                "rgba(236, 72, 153, 0.6)",
              ],
              borderColor: [
                "rgba(239, 68, 68, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(147, 51, 234, 1)",
                "rgba(236, 72, 153, 1)",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            title: {
              display: true,
              text: "Satellite Altitude Distribution",
              color: theme === "dark" ? "#ffffff" : "#000000",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          scales: {
            x: {
              ...baseOptions.scales.x,
              title: {
                display: true,
                text: "Altitude Range",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y: {
              ...baseOptions.scales.y,
              title: {
                display: true,
                text: "Number of Satellites",
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      },

      // Exoplanet Type Distribution (Doughnut)
      exoplanetTypes: {
        data: {
          labels: Object.keys(processedData.exoplanetAnalysis.typeDistribution),
          datasets: [
            {
              data: Object.values(
                processedData.exoplanetAnalysis.typeDistribution
              ),
              backgroundColor: [
                "rgba(239, 68, 68, 0.6)",
                "rgba(245, 158, 11, 0.6)",
                "rgba(34, 197, 94, 0.6)",
                "rgba(59, 130, 246, 0.6)",
                "rgba(147, 51, 234, 0.6)",
                "rgba(236, 72, 153, 0.6)",
              ],
              borderColor: [
                "rgba(239, 68, 68, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(34, 197, 94, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(147, 51, 234, 1)",
                "rgba(236, 72, 153, 1)",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...baseOptions.plugins,
            title: {
              display: true,
              text: "Exoplanet Type Distribution",
              color: theme === "dark" ? "#ffffff" : "#000000",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          animation: enableAnimations
            ? {
                duration: 2000,
                easing: "easeInOutQuart",
              }
            : false,
        },
      },

      // Mission Status Radar Chart
      missionStatus: {
        data: {
          labels: Object.keys(processedData.missionAnalysis.statusDistribution),
          datasets: [
            {
              label: "Mission Status",
              data: Object.values(
                processedData.missionAnalysis.statusDistribution
              ),
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(59, 130, 246, 1)",
              pointBorderColor: "#ffffff",
              pointHoverBackgroundColor: "#ffffff",
              pointHoverBorderColor: "rgba(59, 130, 246, 1)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...baseOptions.plugins,
            title: {
              display: true,
              text: "Mission Status Distribution",
              color: theme === "dark" ? "#ffffff" : "#000000",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          scales: {
            r: {
              ticks: {
                color: theme === "dark" ? "#94a3b8" : "#6b7280",
                stepSize: 1,
              },
              grid: {
                color:
                  theme === "dark"
                    ? "rgba(148, 163, 184, 0.1)"
                    : "rgba(107, 114, 128, 0.1)",
              },
              pointLabels: {
                color: theme === "dark" ? "#e2e8f0" : "#374151",
                font: {
                  size: 12,
                },
              },
            },
          },
          animation: enableAnimations
            ? {
                duration: 2000,
                easing: "easeInOutQuart",
              }
            : false,
        },
      },
    };
  }, [processedData, theme, enableAnimations]);

  // Chart types for navigation
  const chartTypes = [
    { id: "exoplanetScatter", name: "Exoplanet Analysis", component: Scatter },
    { id: "missionCost", name: "Mission Costs", component: Line },
    { id: "satelliteAltitude", name: "Satellite Altitudes", component: Bar },
    { id: "exoplanetTypes", name: "Exoplanet Types", component: Doughnut },
    { id: "missionStatus", name: "Mission Status", component: Radar },
  ];

  useEffect(() => {
    if (processedData) {
      setLoading(false);
    }
  }, [processedData]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Processing data for visualization...</p>
        </div>
      </div>
    );
  }

  if (!chartConfigs) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-red-500">
          <p>No data available for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {chartTypes.map((chartType, index) => (
          <button
            key={chartType.id}
            onClick={() => setActiveChart(index)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
              activeChart === index
                ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                : "border-slate-600 text-slate-300 hover:border-slate-500"
            }`}
          >
            {chartType.name}
          </button>
        ))}
      </div>

      {/* Active Chart */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="h-96">
          {(() => {
            const currentChart = chartTypes[activeChart];
            const ChartComponent = currentChart.component;
            const config = chartConfigs[currentChart.id];

            return (
              <ChartComponent data={config.data} options={config.options} />
            );
          })()}
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Exoplanets</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">
                {processedData.raw.exoplanets.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Habitable:</span>
              <span className="text-green-400">
                {processedData.exoplanetAnalysis.habitableCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Types:</span>
              <span className="text-white">
                {
                  Object.keys(processedData.exoplanetAnalysis.typeDistribution)
                    .length
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Missions</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">
                {processedData.raw.missions.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active:</span>
              <span className="text-green-400">
                {processedData.missionAnalysis.statusDistribution.Active || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Completed:</span>
              <span className="text-blue-400">
                {processedData.missionAnalysis.statusDistribution.Completed ||
                  0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Satellites</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total:</span>
              <span className="text-white">
                {processedData.raw.satellites.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active:</span>
              <span className="text-green-400">
                {processedData.satelliteAnalysis.statusDistribution.Active || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Countries:</span>
              <span className="text-white">
                {
                  Object.keys(
                    processedData.satelliteAnalysis.countryDistribution
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDataVisualization;
