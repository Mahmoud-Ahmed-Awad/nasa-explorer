import React from 'react'
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
  Filler
} from 'chart.js'
import { Scatter, Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ExoplanetCharts = ({ exoplanets }) => {
  // Mass vs Radius Scatter Plot
  const massVsRadiusData = {
    datasets: [
      {
        label: 'Exoplanets',
        data: exoplanets.map(planet => ({
          x: planet.mass,
          y: planet.radius,
          label: planet.name,
          habitable: planet.habitable
        })),
        backgroundColor: (context) => {
          const habitable = context.raw?.habitable || false
          return habitable ? 'rgba(34, 197, 94, 0.6)' : 'rgba(59, 130, 246, 0.6)'
        },
        borderColor: (context) => {
          const habitable = context.raw?.habitable || false
          return habitable ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)'
        },
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  const massVsRadiusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Mass vs Radius Distribution',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            return context[0]?.raw?.label || 'Unknown'
          },
          label: (context) => {
            const point = context.parsed
            const habitable = context.raw?.habitable || false
            return [
              `Mass: ${point.x?.toFixed(2) || 0} Earth masses`,
              `Radius: ${point.y?.toFixed(2) || 0} Earth radii`,
              `Habitable: ${habitable ? 'Yes' : 'No'}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mass (Earth masses)',
          color: '#e2e8f0',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Radius (Earth radii)',
          color: '#e2e8f0',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  }

  // Distance Distribution Histogram
  const distanceRanges = [
    { min: 0, max: 10, label: '0-10 ly' },
    { min: 10, max: 50, label: '10-50 ly' },
    { min: 50, max: 100, label: '50-100 ly' },
    { min: 100, max: 500, label: '100-500 ly' },
    { min: 500, max: 1000, label: '500-1000 ly' },
    { min: 1000, max: Infinity, label: '1000+ ly' }
  ]

  const distanceHistogramData = {
    labels: distanceRanges.map(range => range.label),
    datasets: [
      {
        label: 'Number of Exoplanets',
        data: distanceRanges.map(range => 
          exoplanets.filter(planet => 
            planet.distance >= range.min && planet.distance < range.max
          ).length
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4
      }
    ]
  }

  const distanceHistogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Distance Distribution',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} exoplanets in this range`
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Distance Range',
          color: '#e2e8f0',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Exoplanets',
          color: '#e2e8f0',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#94a3b8',
          stepSize: 1
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Mass vs Radius Scatter Plot */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="h-80">
          <Scatter data={massVsRadiusData} options={massVsRadiusOptions} />
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">Potentially Habitable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-300">Non-Habitable</span>
          </div>
        </div>
      </div>

      {/* Distance Distribution Histogram */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="h-80">
          <Bar data={distanceHistogramData} options={distanceHistogramOptions} />
        </div>
      </div>
    </div>
  )
}

export default ExoplanetCharts