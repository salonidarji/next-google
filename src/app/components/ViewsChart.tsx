import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { ChartData,Chart, registerables } from 'chart.js';

interface ViewsChartProps {
  viewsData: string[];
  labelData: string[];
}

const ViewsChart: React.FC<ViewsChartProps> = ({ viewsData, labelData }) => {
  const [chartData, setChartData] = useState<any>(null);

  Chart.register(...registerables);
  useEffect(() => {
    const data: ChartData = {
      labels: labelData, 
      datasets: [
        {
          label: 'Views',
          data: viewsData as [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    setChartData(data);
  }, [viewsData]);

  return (
    <div>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default ViewsChart;