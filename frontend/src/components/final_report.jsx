import React from "react";
import '../styls/final.css';

function AngiogramReportView(props) {
    const reportData = props.rep_data
    const patientData = props.pat_data
    const images = props.image_files
    return (
        <div className="report-container">
            <h1>Cardiology Unit</h1>
            <h2>TH Peradeniya</h2>
            <p>(SBSCH Cardiac Catheterization Lab)</p>
            <p>PER</p>
            
            <table className="info-table">
                <tbody>
                    <tr>
                        <td><label>Name:</label></td>
                        <td>{patientData.name}</td>
                    </tr>
                    <tr>
                        <td><label>DOB:</label></td>
                        <td>{patientData.birth}</td>
                    </tr>
                    <tr>
                        <td><label>Age:</label></td>
                        <td>{reportData.Age}</td>
                    </tr>
                    <tr>
                        <td><label>operators:</label></td>
                        <td>{props.doctor}</td>
                    </tr>
                    <tr>
                        <td><label>Indication:</label></td>
                        <td>{reportData.Indication}</td>
                    </tr>
                    <tr>
                        <td><label>BHT:</label></td>
                        <td>{reportData.BHT}</td>
                    </tr>
                    <tr>
                        <td><label>Vascular Access:</label></td>
                        <td>{reportData.Vascular}</td>
                    </tr>
                    <tr>
                        <td><label>Catheters:</label></td>
                        <td>{reportData.Catheters}</td>
                    </tr>
                </tbody>
            </table>

            <div className="procedure-details">
                <h3>PCI to LAD/LCX/RCA</h3>
                <p>
                    LMS/RCA engaged with XB 3 JR 3.5 {reportData.catheter_type} guiding catheter.
                </p>
                <p>
                    The LAD LCX RCA lesion was crossed with a Sion Blue/Floppy guide wire.
                </p>
                <p>
                    {reportData.discription}
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

            <div className="recommendations">
                <h3>Recommendations:</h3>
                <p>Aspirin 75/150 mg for lifelong.</p>
                <p>Clopidogrel/Prasugrel/Ticagrelor based on physician's prescription.</p>
            </div>
            <div className="image-grid">
                <div className="image-cell">
                    <label>Image 1:</label>
                    <img
                        src={images[0]}
                        alt="img1"
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
            <div className="signature">
                <p>{props.doctor}</p>
            </div>
        </div>
    );
}

export default AngiogramReportView;
