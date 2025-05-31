'use client'
import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function AdminStats() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        const { postsByCategory } = data
        
        // Prepare data for chart
        const chartData = {
          labels: Object.keys(postsByCategory).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
          datasets: [
            {
              label: 'Posts by Category',
              data: Object.values(postsByCategory),
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
                'rgba(78, 129, 37, 0.6)',
                'rgba(225, 78, 202, 0.6)'
              ]
            }
          ]
        }
        
        setChartData(chartData)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading stats...</div>
  }

  if (!chartData) {
    return <div className="h-64 flex items-center justify-center">No data available</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Posts by Category</h3>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Posts: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}