import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await api.get('/api/reports/');
        const reports = response.data;

        // Debugging: log the fetched reports data
        console.log("Fetched Reports Data:", reports);

        // Example: Extract dates and create a dataset for total procedures
        const labels = reports.map((report) => report.date); // Get report dates
        const totalProcedures = reports.map(() => 1); // Count each procedure as 1

        console.log("Chart Labels:", labels);
        console.log("Total Procedures Data:", totalProcedures);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Procedures',
              data: totalProcedures,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching reports data:', error);
      }
    };

    fetchReportsData();
  }, []);

  return (
    <div>
      <h2>Total Procedures Over Time</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Total Procedures Over Time',
            },
          },
        }}
      />
    </div>
  );
};

export default ReportsChart;
