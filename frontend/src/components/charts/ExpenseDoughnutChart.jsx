import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#d97706', '#db2777', '#64748b']

export default function ExpenseDoughnutChart({ labels, amounts, height = 220 }) {
  if (!labels?.length) return null

  return (
    <div style={{ maxHeight: height }}>
      <Doughnut
        data={{
          labels,
          datasets: [
            {
              data: amounts,
              backgroundColor: COLORS,
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 14, usePointStyle: true, pointStyle: 'circle' },
            },
          },
        }}
      />
    </div>
  )
}
