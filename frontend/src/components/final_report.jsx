import React from "react";
import '../styls/final.css'; // Importing the CSS file for styling the component

function AngiogramReportView(props) {
    // Destructuring props to extract report data, patient data, and images
    const reportData = props.rep_data; // Contains report-specific data
    const patientData = props.pat_data; // Contains patient-specific data
    const images = props.image_files; // Array of image file paths

    return (
        <div className="report-container">
            {/* Header Section: Displays basic hospital/unit information */}
            <h1>Cardiology Unit</h1>
            <h2>TH Peradeniya</h2>
            <p>(SBSCH Cardiac Catheterization Lab)</p>
            <p>PER</p>
            <p>{reportData.Date}</p>
            {/* Patient and Report Information Section */}
            <table className="info-table">
                <tbody>
                    <tr>
                        <td><label>Name:</label></td>
                        <td>{patientData.name}</td> {/* Patient's name */}
                    </tr>
                    <tr>
                        <td><label>DOB:</label></td>
                        <td>{patientData.birth}</td> {/* Patient's date of birth */}
                    </tr>
                    <tr>
                        <td><label>Age:</label></td>
                        <td>{reportData.Age}</td> {/* Patient's age */}
                    </tr>
                    <tr>
                        <td><label>Operators:</label></td>
                        <td>{props.doctor}</td> {/* Name of the operating doctor */}
                    </tr>
                    <tr>
                        <td><label>Indication:</label></td>
                        <td>{reportData.Indication}</td> {/* Indication for the procedure */}
                    </tr>
                    <tr>
                        <td><label>BHT:</label></td>
                        <td>{reportData.BHT}</td> {/* Bed Head Ticket number */}
                    </tr>
                    <tr>
                        <td><label>Vascular Access:</label></td>
                        <td>{reportData.Vascular}</td> {/* Details of vascular access */}
                    </tr>
                    <tr>
                        <td><label>Catheters:</label></td>
                        <td>{reportData.Catheters}</td> {/* Details of catheters used */}
                    </tr>
                </tbody>
            </table>

            {/* Procedure Details Section */}
            <div className="procedure-details">
                <h3>PCI to LAD/LCX/RCA</h3> {/* Title of the procedure */}
                <p>
                    LMS/RCA engaged with XB 3 JR 3.5 {reportData.catheter_type} guiding catheter.
                </p>
                <p>
                    The LAD LCX RCA lesion was crossed with a Sion Blue/Floppy guide wire.
                </p>
                <p>
                    {reportData.discription} {/* Procedure description */}
                </p>
                <p>
                    The lesion was pre-dilated with {reportData.baloon_size} SC/NC balloon at {reportData.baloon_presure} atm.
                </p>
                <p>
                    The lesion was stented with a {reportData.stent_name} DES at {reportData.stent_pressure} atm.
                </p>
                <p>
                    Good final angiographic results with TIMI III flow were achieved in LAD/LCX/RCA and branches.
                </p>
            </div>

            {/* Recommendations Section */}
            <div className="recommendations">
                <h3>Recommendations:</h3>
                <p>Aspirin 75/150 mg for lifelong.</p> {/* Lifelong medication */}
                <p>Clopidogrel/Prasugrel/Ticagrelor based on physician's prescription.</p> {/* Physician-specific medication */}
            </div>

            {/* Image Gallery Section */}
            <div className="image-grid">
                {/* Displays up to 4 images with labels */}
                <div className="image-cell">
                    <label>Image 1:</label>
                    <img
                        src={images[0]}
                        alt="img1" // Descriptive alt text for accessibility
                    />
                </div>
                <div className="image-cell">
                    <label>Image 2:</label>
                    <img
                        src={images[1]}
                        alt="img"
                    />
                </div>
                <div className="image-cell">
                    <label>Image 3:</label>
                    <img
                        src={images[2]}
                        alt="img"
                    />
                </div>
                <div className="image-cell">
                    <label>Image 4:</label>
                    <img
                        src={images[3]}
                        alt="img"
                    />
                </div>
            </div>

            {/* Signature Section */}
            <div className="signature">
                <p>{props.doctor}</p> {/* Doctor's name as a signature */}
            </div>
        </div>
    );
}

export default AngiogramReportView; // Exporting the component for use in other parts of the application
