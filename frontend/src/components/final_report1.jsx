import React from "react";
import '../styls/final.css';

function AngiogramReportView1(props) {
    // Destructure the props for easier access
    const reportData = props.rep_data; // Contains angiogram report details
    const patientData = props.pat_data; // Contains patient-related details
    const images = props.image_files; // Contains an array of image file paths

    return (
        <div className="report-container">
            {/* Header section for the hospital/unit details */}
            <h1>Cardiology Unit</h1>
            <h2>TH Peradeniya</h2>
            <p>(SBSCH Cardiac Catheterization Lab)</p>
            <p>PER</p>
            
            {/* Table displaying patient and procedural information */}
            <table className="info-table">
                <tbody>
                    <tr>
                        <td><label>Name:</label></td>
                        <td>{patientData.name}</td> {/* Displays patient name */}
                    </tr>
                    <tr>
                        <td><label>DOB:</label></td>
                        <td>{patientData.birth}</td> {/* Displays patient date of birth */}
                    </tr>
                    <tr>
                        <td><label>Operators:</label></td>
                        <td>{reportData.oparators}</td> {/* Displays operator/doctor information */}
                    </tr>
                    <tr>
                        <td><label>Indication:</label></td>
                        <td>{reportData.Indication}</td> {/* Displays the procedure indication */}
                    </tr>
                    <tr>
                        <td><label>BHT:</label></td>
                        <td>{reportData.BHT}</td> {/* Displays BHT number */}
                    </tr>
                    <tr>
                        <td><label>Vascular Access:</label></td>
                        <td>{reportData.Vascular_Access}</td> {/* Displays vascular access details */}
                    </tr>
                    <tr>
                        <td><label>Catheters:</label></td>
                        <td>{reportData.Catheters}</td> {/* Displays catheter details */}
                    </tr>
                </tbody>
            </table>

            {/* Section for detailing the procedure steps and results */}
            <div className="procedure-details">
                <h3>PCI to LAD/LCX/RCA</h3>
                <p>
                    LMS/RCA engaged with XB 3 JR 3.5 {reportData.catheter_type} guiding catheter.
                </p>
                <p>
                    The LAD LCX RCA lesion was crossed with a Sion Blue/Floppy guide wire.
                </p>
                <p>
                    {reportData.discription} {/* Displays a custom description of the procedure */}
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

            {/* Section for post-procedure recommendations */}
            <div className="recommendations">
                <h3>Recommendations:</h3>
                <p>Aspirin 75/150 mg for lifelong.</p>
                <p>Clopidogrel/Prasugrel/Ticagrelor based on physician's prescription.</p>
            </div>

            {/* Section for displaying angiogram images */}
            <div className="image-grid">
                <div className="image-cell">
                    <label>Image 1:</label>
                    <img
                        src={images[0]} // Displays the first image
                        alt="img1"
                    />
                </div>
                <div className="image-cell">
                    <label>Image 2:</label>
                    <img
                        src={images[1]} // Displays the second image
                        alt="img"
                    />
                </div>
                <div className="image-cell">
                    <label>Image 3:</label>
                    <img
                        src={images[2]} // Displays the third image
                        alt="img"
                    />
                </div>
                <div className="image-cell">
                    <label>Image 4:</label>
                    <img
                        src={images[3]} // Displays the fourth image
                        alt="img"
                    />
                </div>
            </div>

            {/* Footer section for operator/doctor signature */}
            <div className="signature">
                <p>{reportData.oparators}</p> {/* Displays the operator/doctor's name */}
            </div>
        </div>
    );
}

export default AngiogramReportView1;
