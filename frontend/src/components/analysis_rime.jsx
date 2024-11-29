import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import api from '../api'; // API utility for making backend requests
import '../styls/AngiogramForm.css'; // Add a CSS file for styling

// Register required Chart.js components for creating different chart types
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ReportsChart = () => {
  // State to store data for the first chart (Total Procedures Over Time)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // State to determine which chart to display based on user selection
  const [graph1, setGraph1] = useState("0");

  // Fetch and set data for the Total Procedures chart when selected
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await api.get('/api/reports/');
        const reports = response.data;
        console.log("Fetched Reports Data:", reports);

        // Extract labels (dates) and data (procedure counts) from API response
        const labels = reports.map((report) => report.date);
        const totalProcedures = reports.map((report) => report.procedure_count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Procedures',
              data: totalProcedures,
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Fill color for chart bars
              borderColor: 'rgba(75, 192, 192, 1)', // Border color for chart bars
              borderWidth: 1, // Border width
              fill: false, // Disable area fill under line chart
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

  // State to store data for the Age Distribution chart
  const [ageDistributionData, setAgeDistributionData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch and set data for the Age Distribution chart when selected
  useEffect(() => {
    const fetchAgeDistributionData = async () => {
      try {
        const response = await api.get('/api/AgeDistribution/reports/');
        const ageDistribution = response.data;
        console.log("Fetched Age Distribution Data:", ageDistribution);

        // Extract labels (age groups) and data (patient counts) from API response
        const labels = ageDistribution.map((item) => item.age_group);
        const patientCounts = ageDistribution.map((item) => item.patient_count);

        setAgeDistributionData({
          labels: labels,
          datasets: [
            {
              label: 'Patient Count by Age Group',
              data: patientCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.6)', // Bar color
              borderColor: 'rgba(153, 102, 255, 1)', // Border color
              borderWidth: 1, // Border width
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

  // State to store data for the Catheter Type chart
  const [catheterData, setCatheterData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch and set data for the Catheter Type chart when selected
  useEffect(() => {
    const fetchCatheterData = async () => {
      try {
        const response = await api.get('/api/CatheterType/reports/');
        const catheterReports = response.data;
        console.log("Fetched Catheter Type Data:", catheterReports);

        // Extract labels (catheter types) and data (counts) from API response
        const labels = catheterReports.map((item) => item.catheter_type);
        const counts = catheterReports.map((item) => item.count);

        setCatheterData({
          labels: labels,
          datasets: [
            {
              label: 'Catheter Type Count',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Individual colors for pie chart segments
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: 'rgba(255, 159, 64, 1)', // Border color for pie chart segments
              borderWidth: 1, // Border width
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
    <div className="form-container-analyze">
      {/* Page Title */}
      <h1>Reports</h1>
      
      {/* Buttons for selecting different charts */}
      <div className="button-container">
        <button onClick={() => setGraph1("1")} className="chart-button">Show Total Procedures Graph</button>
        <button onClick={() => setGraph1("2")} className="chart-button">Show Age Distribution Graph</button>
        <button onClick={() => setGraph1("3")} className="chart-button">Show Catheter Type Graph</button>
      </div>

      {/* Display selected chart */}
      <div className="main-report-body">
        {graph1 === "1" && (
          <div>
            <h2>Total Procedures Over Time</h2>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Total Procedures Over Time' },
                },
                scales: { y: { beginAtZero: true } },
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
                  legend: { position: 'top' },
                  title: { display: true, text: 'Patient Count by Age Group' },
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
                  legend: { position: 'top' },
                  title: { display: true, text: 'Catheter Type Count' },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsChart;
