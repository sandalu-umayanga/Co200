import React, { useState } from "react";
import api from "../api";
import "../styls/patients.css";
import AngiogramReportView1 from "./final_report1";

export default function P_search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchBy, setSearchBy] = useState("hospital_id");
  const [reports, setReports] = useState([]);
  const [images, setImages] = useState([]);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [clickedButton, setClickedButton] = useState(null); // To track the clicked button

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    try {
      const response = await api.get(
        `/api/patient/search/?query=${event.target.value}&colum=${searchBy}`
      );
      setSearchResults(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleResultClick = (patient) => {
    setSearchTerm(patient.national_id);
    setSelectedPatient(patient);
    setShowPopup(false);
  };

  const handleSelect = (search, buttonName) => {
    setSearchBy(search);
    setClickedButton(buttonName); // Update clicked button state
  };

  const handlereports = async () => {
    try {
      const response = await api.post("/api/oldreports/", {
        person_id: selectedPatient.id,
      });
      setReports(response.data);
      setCurrentReportIndex(0);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }

    try {
      const response1 = await api.post(`/api/images/`, {
        hos_id: selectedPatient.hospital_id,
      });
      const imageUrls = response1.data.length
        ? response1.data[0].report_imgs
        : [];
      const formattedImages = imageUrls.map((imgUrl) => {
        const imageUrl = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
        return `${import.meta.env.VITE_API_URL}${imageUrl}`;
      });
      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleNextReport = () => {
    if (currentReportIndex < reports.length - 1) {
      setCurrentReportIndex(currentReportIndex + 1);
    }
  };

  const handlePreviousReport = () => {
    if (currentReportIndex > 0) {
      setCurrentReportIndex(currentReportIndex - 1);
    }
  };

  return (
    <nav className="search-bar">
      <div className="button-set1">
        <h1>Search by :</h1>
        <button
          className={`national_id-button ${
            clickedButton === "national_id" ? "clicked" : ""
          }`}
          onClick={() => handleSelect("national_id", "national_id")}
        >
          National ID
        </button>
        <button
          className={`hospital_id-button ${
            clickedButton === "hospital_id" ? "clicked" : ""
          }`}
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

      <div className="psearch-container">
        <input
          type="text"
          placeholder={`Search by ${searchBy
            .replace("_", " ")
            .toUpperCase()}...`}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {showPopup && searchResults.length > 0 && (
          <div className="search-popup">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="search-result"
                onClick={() => handleResultClick(result)}
              >
                National_ID : {result.national_id} -- Hospital_ID :{" "}
                {result.hospital_id} -- Name: {result.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {!showPopup && selectedPatient && (
        <div className="selected-patient">
          <div className="side-by-side-container1">
            <table className="patient-table">
              <tbody>
                <tr>
                  <td>
                    <strong>National ID:</strong>
                  </td>
                  <td>{selectedPatient.national_id}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Hospital ID:</strong>
                  </td>
                  <td>{selectedPatient.hospital_id}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Name:</strong>
                  </td>
                  <td>{selectedPatient.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Date of Birth:</strong>
                  </td>
                  <td>{selectedPatient.birth}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Address:</strong>
                  </td>
                  <td>{selectedPatient.address}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contact:</strong>
                  </td>
                  <td>{selectedPatient.contact}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email:</strong>
                  </td>
                  <td>
                    {selectedPatient.email ? selectedPatient.email : "N/A"}
                  </td>
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
                    disabled={currentReportIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextReport}
                    disabled={currentReportIndex === reports.length - 1}
                  >
                    Next
                  </button>
                </div>
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
