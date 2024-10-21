import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ReportsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [graph1, setGraph1] = useState("0");

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await api.get('/api/reports/');
        const reports = response.data;
        console.log("Fetched Reports Data:", reports);

        const labels = reports.map((report) => report.date); 
        const totalProcedures = reports.map((report) => report.procedure_count);  

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Procedures',
              data: totalProcedures,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching reports data:', error);
      }
    };

    if (graph1 === "1") {
      fetchReportsData();
    }
  }, [graph1]);

  const [ageDistributionData, setAgeDistributionData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchAgeDistributionData = async () => {
      try {
        const response = await api.get('/api/AgeDistribution/reports/');  
        const ageDistribution = response.data;
        console.log("Fetched Age Distribution Data:", ageDistribution);
        const labels = ageDistribution.map((item) => item.age_group);
        const patientCounts = ageDistribution.map((item) => item.patient_count);

        setAgeDistributionData({
          labels: labels,
          datasets: [
            {
              label: 'Patient Count by Age Group',
              data: patientCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching age distribution data:', error);
      }
    };

    if (graph1 === "2") {
      fetchAgeDistributionData();
    }
  }, [graph1]);

  const [catheterData, setCatheterData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchCatheterData = async () => {
      try {
        const response = await api.get('/api/CatheterType/reports/');
        const catheterReports = response.data;
        console.log("Fetched Catheter Type Data:", catheterReports);
        const labels = catheterReports.map((item) => item.catheter_type);
        const counts = catheterReports.map((item) => item.count);

        setCatheterData({
          labels: labels,
          datasets: [
            {
              label: 'Catheter Type Count',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching catheter data:', error);
      }
    };

    if (graph1 === "3") {
      fetchCatheterData();
    }
  }, [graph1]);

  return (
    <div>
      <div>
        <button onClick={() => setGraph1("1")}>Show Total Procedures Graph</button>
        <button onClick={() => setGraph1("2")}>Show Age Distribution Graph</button>
        <button onClick={() => setGraph1("3")}>Show Catheter Type Graph</button>
      </div>

      {graph1 === "1" && (
        <div>
          <h2>Total Procedures Over Time</h2>
          <Line
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
              scales: {
                y: {
                  beginAtZero: true, // Ensure Y-axis starts at 0
                },
              },
            }}
          />
        </div>
      )}

      {graph1 === "2" && (
        <div>
          <h2>Age Distribution of Patients</h2>
          <Bar
            data={ageDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Patient Count by Age Group',
                },
              },
            }}
          />
        </div>
      )}

      {graph1 === "3" && (
        <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
          <h2>Catheter Type Distribution</h2>
          <Pie
            data={catheterData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Catheter Type Count',
                },
              },
              maintainAspectRatio: false, // Disable aspect ratio to allow custom sizing
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsChart;