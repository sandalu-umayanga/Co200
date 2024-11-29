import React, { useState } from "react";
import api from "../api";
import "../styls/patients.css";
import AngiogramReportView1 from "./final_report1";

export default function P_search() {
  // State variables
  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term entered by the user
  const [searchResults, setSearchResults] = useState([]); // Stores the search results based on the search term
  const [showPopup, setShowPopup] = useState(false); // Determines whether to show the search results popup
  const [selectedPatient, setSelectedPatient] = useState(null); // Stores the selected patient details
  const [searchBy, setSearchBy] = useState("hospital_id"); // The search criteria (e.g., 'hospital_id', 'national_id', or 'name')
  const [reports, setReports] = useState([]); // Stores the reports fetched for the selected patient
  const [images, setImages] = useState([]); // Stores the image URLs related to the selected patient's reports
  const [currentReportIndex, setCurrentReportIndex] = useState(0); // Tracks the index of the currently displayed report
  const [clickedButton, setClickedButton] = useState(null); // Tracks which search filter button is clicked

  // Handle search input change
  const handleSearch = async (event) => {
    setSearchTerm(event.target.value); // Update the search term
    try {
      // Send an API request to search patients based on the current search term and selected search criterion
      const response = await api.get(
        `/api/patient/search/?query=${event.target.value}&colum=${searchBy}`
      );
      setSearchResults(response.data); // Update search results with the fetched data
      setShowPopup(true); // Show the popup with the search results
    } catch (error) {
      console.error("Error fetching search results:", error); // Handle any errors
    }
  };

  // Handle click on a specific search result
  const handleResultClick = (patient) => {
    setSearchTerm(patient.national_id); // Update the search term with the selected patient's national ID
    setSelectedPatient(patient); // Set the selected patient data
    setShowPopup(false); // Hide the search result popup
  };

  // Handle selection of search filter (National ID, Hospital ID, or Name)
  const handleSelect = (search, buttonName) => {
    setSearchBy(search); // Set the search criterion to the selected filter
    setClickedButton(buttonName); // Mark the clicked button as selected
  };

  // Fetch reports and images for the selected patient
  const handlereports = async () => {
    try {
      // Fetch the patient's reports using their ID
      const response = await api.post("/api/oldreports/", {
        person_id: selectedPatient.id,
      });
      setReports(response.data); // Update reports state with the fetched data
      setCurrentReportIndex(0); // Reset the report index to 0 (first report)
    } catch (error) {
      console.error("Error fetching reports:", error); // Handle any errors
    }

    try {
      // Fetch images related to the selected patient's hospital ID
      const response1 = await api.post(`/api/images/`, {
        hos_id: selectedPatient.hospital_id,
      });
      const imageUrls = response1.data.length
        ? response1.data[0].report_imgs // Extract image URLs from the response
        : [];
      const formattedImages = imageUrls.map((imgUrl) => {
        const imageUrl = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
        return `${import.meta.env.VITE_API_URL}${imageUrl}`; // Format image URLs with the correct base URL
      });
      setImages(formattedImages); // Update images state with the formatted URLs
    } catch (error) {
      console.error("Error fetching images:", error); // Handle any errors
    }
  };

  // Navigate to the next report
  const handleNextReport = () => {
    if (currentReportIndex < reports.length - 1) {
      setCurrentReportIndex(currentReportIndex + 1); // Increase the report index
    }
  };

  // Navigate to the previous report
  const handlePreviousReport = () => {
    if (currentReportIndex > 0) {
      setCurrentReportIndex(currentReportIndex - 1); // Decrease the report index
    }
  };

  return (
    <nav className="search-bar">
      {/* Search filter selection buttons */}
      <div className="button-set1">
        <h1>Search by :</h1>
        <button
          className={`national_id-button ${clickedButton === "national_id" ? "clicked" : ""}`}
          onClick={() => handleSelect("national_id", "national_id")}
        >
          National ID
        </button>
        <button
          className={`hospital_id-button ${clickedButton === "hospital_id" ? "clicked" : ""}`}
          onClick={() => handleSelect("hospital_id", "hospital_id")}
        >
          Hospital ID
        </button>
        <button
          className={`name-button ${clickedButton === "name" ? "clicked" : ""}`}
          onClick={() => handleSelect("name", "name")}
        >
          Name
        </button>
      </div>

      {/* Search input field */}
      <div className="psearch-container">
        <input
          type="text"
          placeholder={`Search by ${searchBy.replace("_", " ").toUpperCase()}...`}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {showPopup && searchResults.length > 0 && (
          <div className="search-popup">
            {/* Display search results */}
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="search-result"
                onClick={() => handleResultClick(result)} // Handle clicking a search result
              >
                National_ID : {result.national_id} -- Hospital_ID :{" "}
                {result.hospital_id} -- Name: {result.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display selected patient's details and reports */}
      {!showPopup && selectedPatient && (
        <div className="selected-patient">
          <div className="side-by-side-container1">
            <table className="patient-table">
              {/* Patient details displayed in a table */}
              <tbody>
                <tr>
                  <td><strong>National ID:</strong></td>
                  <td>{selectedPatient.national_id}</td>
                </tr>
                <tr>
                  <td><strong>Hospital ID:</strong></td>
                  <td>{selectedPatient.hospital_id}</td>
                </tr>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{selectedPatient.name}</td>
                </tr>
                <tr>
                  <td><strong>Date of Birth:</strong></td>
                  <td>{selectedPatient.birth}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>{selectedPatient.address}</td>
                </tr>
                <tr>
                  <td><strong>Contact:</strong></td>
                  <td>{selectedPatient.contact}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td>{selectedPatient.email ? selectedPatient.email : "N/A"}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={handlereports}>Fetch Reports</button>
          </div>

          <div className="side-by-side-container2">
            {reports.length > 0 && (
              <div className="report-view">
                <div className="navigation-buttons">
                  <button
                    onClick={handlePreviousReport}
                    disabled={currentReportIndex === 0} // Disable if it's the first report
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextReport}
                    disabled={currentReportIndex === reports.length - 1} // Disable if it's the last report
                  >
                    Next
                  </button>
                </div>
                {/* Display the current report */}
                <AngiogramReportView1
                  rep_data={reports[currentReportIndex]}
                  pat_data={selectedPatient}
                  image_files={images}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
