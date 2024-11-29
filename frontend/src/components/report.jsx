import React from "react";
import api from "../api";
import "../styls/AngiogramForm.css";
import AngiogramReportView from "./final_report";
import { useNavigate } from "react-router-dom";

function Report() {
  const navigate = useNavigate();

  // Today's date formatted as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // State variables to manage component data
  const [images, setImages] = React.useState([]); // Stores the list of images
  const [doctor, setDoctor] = React.useState(""); // Stores the doctor's name and specialty
  const [patient, setPatient] = React.useState(null); // Stores patient details
  const [preview, setPreview] = React.useState(false); // Controls report preview visibility
  const [hos_id, set_hos_id] = React.useState(""); // Stores the entered hospital ID
  const [err, seterr] = React.useState(null); // Stores error message for images
  const [err1, seterr1] = React.useState(null); // Stores error message for patient search
  const [isimg, setIsimg] = React.useState(null); // Tracks the selected image for preview
  const [imgpath, setImgpath] = React.useState([]); // Stores paths for the images
  const [p_image, setP_image] = React.useState([]); // Stores processed images for preview
  const [formData, setFormData] = React.useState({
    name: "",
    Date: today,
    Age: "",
    DOB: "",
    Indication: "",
    BHT: "",
    Vascular: "",
    Catheters: "",
    catheter_type: "",
    discription: " ",
    baloon_size: "",
    baloon_presure: "",
    stent_name: "",
    stent_pressure: "",
  }); // Object to store form data inputs

  // Updates hospital ID as user types
  function handleSearch(event) {
    set_hos_id(event.target.value);
  }

  // Updates selected image for processing
  function handleImageChange(event) {
    const selectedIndex = parseInt(event.target.id, 10) - 1;
    processing(selectedIndex); // Triggers image processing for the selected index

    // Predefined processed image paths
    const pimage_path = [
      "media/processed_images/1.jpg",
      "media/processed_images/2.jpg",
      "media/processed_images/3.jpg",
      "media/processed_images/4.jpg",
    ];

    // Append base URL to processed image paths
    const fpimages = pimage_path.map((url) => {
      const timestamp = new Date().getTime(); // Generate a unique timestamp
      return `${import.meta.env.VITE_API_URL}${url}?_=${timestamp}`;
    });

    setP_image(fpimages); // Set processed images for the preview
    const selectedImage = images[selectedIndex];
    setIsimg(selectedImage); // Update state with selected image
  }

  // Resets the form and navigates back to patient search
  function handleback() {
    setImages([]);
    setPreview(false);
    setIsimg(null);
    navigate("/patient-search");
  }

  // Sends request to process the image for the given index
  const processing = async (id1) => {
    try {
      const response3 = await api.post("/api/imageProcess/", {
        path2: imgpath[0],
        value0: id1,
      });
      showAlert(response3.data.aaa); // Shows success message
    } catch (error) {
      console.error("Error:", error);
      showAlert("An error occurred while processing the request.", true); // Shows error message
    }
  };

  // Update the preview image to the first processed image
  function change1() {
    setIsimg(p_image[0]);
  }
  function change2() {
    setIsimg(p_image[1]);
  }
  function change3() {
    setIsimg(p_image[2]);
  }
  function change4() {
    setIsimg(p_image[3]);
  }

  // Prints the report using a new window
  function handlePrint() {
    const printableContent = document.querySelector('.printable-section').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow.document.open();
    printWindow.document.write(`
        <html>
          <head>
              <title>Print</title>
              <style>
                  /* AngiogramForm.css */

                  .report-container {
                      width: 800px;
                      margin: 0 auto;
                      font-family: Arial, sans-serif;
                      color: #333;
                      background-color: #f9f9f9;
                      padding: 20px;
                      border-radius: 8px;
                  }

                  h1, h2 {
                      text-align: center;
                      margin-bottom: 10px;
                  }

                  p {
                      text-align: center;
                      font-size: 14px;
                  }

                  .info-table {
                      width: 95%;
                      margin-top: 20px;
                      border-collapse: collapse;
                  }

                  .info-table td {
                      padding: 8px;
                      border: 1px solid #ddd;
                      font-size: 14px;
                  }

                  .info-table label {
                      font-weight: bold;
                      color: #555;
                  }

                  .procedure-details {
                      margin-top: 20px;
                      padding: 10px;
                      background-color: #f1f1f1;
                      border-radius: 5px;
                  }

                  .procedure-details h3 {
                      margin-top: 0;
                      font-size: 16px;
                  }

                  .procedure-details p {
                      margin: 8px 0;
                      font-size: 16px;
                      text-align: left;
                  }

                  .recommendations {
                      margin-top: 20px;
                      page-break-after: always;
                  }

                  .recommendations h3 {
                      font-size: 16px;
                      margin-bottom: 8px;
                  }

                  .recommendations p {
                      font-size: 16px;
                      color: #000000;
                      margin: 6px 0;
                      text-align: left;
                  }

                  .signature {
                      margin-top: 40px;
                      text-align: right;
                      font-size: 14px;
                  }

                  .signature p {
                      margin: 5px 0;
                  }

                  .image-grid {
                      display: grid;
                      grid-template-columns: repeat(2, 1fr);
                      gap: 10px;
                      margin-top: 20px;
                      page-break-before: always;
                  }

                  .image-cell {
                      text-align: center;
                      display: flex;
                      flex-direction: column;
                  }

                  .image-cell img {
                      max-width: 300px;
                      max-height: 300px;
                      border: 1px solid #ddd;
                      border-radius: 5px;
                  }

              </style>
            </head>
        <body>
            ${printableContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

  // Submits the form data to save the report
  const handlesubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("api/report/", {
        Indication: formData.Indication,
        BHT: formData.BHT,
        oparators: doctor, // Include operator details
        Vascular_Access: formData.Vascular,
        Catheters: formData.Catheters,
        catheter_type: formData.catheter_type,
        discription: formData.discription,
        baloon_size: formData.baloon_size,
        baloon_presure: formData.baloon_presure,
        stent_name: formData.stent_name,
        stent_pressure: formData.stent_pressure,
        hospital_id: hos_id, // Include this if required by your backend
      });
      alert("Report saved successfully!");
      setPreview(true); // Switch to preview mode
    } catch (error) {
      console.error(
        "Error submitting report:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred while submitting the report.");
    }
  };

  // Updates form data as user types
  function handleChange(event) {
    const { name, value } = event.target;
    const new_data = {
      ...formData,
      [name]: value,
    };

    setFormData(new_data);
  }

  // Calculates age based on date of birth
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  // Searches for patient and image data
  const search = async (event) => {
    event.preventDefault();
    try {
      const response = await api.get(
        `/api/patient/search/?query=${hos_id}&colum=get`
      );
      const patientData = response.data[0];

      if (patientData) {
        setPatient(patientData); // Save patient details
        setFormData((prevData) => ({
          ...prevData,
          name: patientData.name,
          Age: calculateAge(patientData.birth),
          DOB: patientData.birth,
        }));
        seterr1(null); // Clear patient search error
      } else {
        seterr1("not registerd"); // Display error if patient not found
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
    try {
      const response1 = await api.post(`/api/images/`, {
        hos_id: hos_id,
        today: true,
      });
      setImgpath(response1.data); // Save image paths
      const imageUrls = response1.data.length
        ? response1.data[0].report_imgs
        : [];
      const formattedImages = imageUrls.map((imgUrl) => {
        const imageUrl = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
        return `${import.meta.env.VITE_API_URL}${imageUrl}`;
      });
      seterr(null); // Clear image search error
      setImages(formattedImages); // Save formatted image URLs
    } catch (error) {
      seterr(error.response.data.error); // Display image search error
    }
  };

  // Fetches the logged-in doctor's profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile/");
      setDoctor(`Dr.${res.data.name} , ${res.data.specility}`);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      alert("An error occurred while fetching profile data.");
    }
  };

  // Fetch the doctor's profile when the component loads
  React.useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
    };

    fetchData();
  }, []);

  // Shows a custom alert message
  function showAlert(message, isError = false) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    const alertClose = document.getElementById("alertClose");
    const alertContainer = alertBox.querySelector(".custom-alert-box");

    alertContainer.style.backgroundColor = isError ? "#ffcccb" : "#c7e8c3"; // Set alert color
    alertMessage.textContent = message; // Set alert message
    alertBox.style.display = "block"; // Display alert
    alertClose.onclick = () => {
      alertBox.style.display = "none";
    }; // Close alert
  }

  return (
    <div className="main-report-body-patient-report">
      <div id="customAlert" class="custom-alert hidden">
        <div class="custom-alert-box">
          <p id="alertMessage"></p>
          <button id="alertClose">OK</button>
        </div>
      </div>

      {!preview && (
        <div>
          <div className="err-msg-report">
            <p>{err1}</p>
            <p>{err}</p>
          </div>
          <div className="search-container">
            <form className="search-container" onSubmit={search}>
              <label>Hospital ID</label>
              <input
                type="text"
                onChange={handleSearch}
                value={hos_id}
                placeholder="Enter Hospital ID"
              />
              <button type="submit">Search</button>
            </form>
          </div>
          <div className="main-form">
            <div className="form-container-patient-report form-text">
              <h1>Cardiology Unit</h1>
              <h2>TH Peradeniya</h2>
              <p>(SBSCH Cardiac Catheterization Lab)</p>
              <p>PER</p>

              <form>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td>
                        <label>Name:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={formData.name}
                          readOnly
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Date:</label>
                      </td>
                      <td>
                        <input type="date" value={formData.Date} readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Age:</label>
                      </td>
                      <td>
                        <input type="number" value={formData.Age} readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>DOB:</label>
                      </td>
                      <td>
                        <input type="date" value={formData.DOB} readOnly />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Indication:</label>
                      </td>
                      <td colSpan="3">
                        <input
                          type="text"
                          name="Indication"
                          onChange={handleChange}
                          value={formData.Indication}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>BHT:</label>
                      </td>
                      <td colSpan="3">
                        <input
                          type="text"
                          name="BHT"
                          onChange={handleChange}
                          value={formData.BHT}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Operators:</label>
                      </td>
                      <td colSpan="3">
                        <input type="text" value={doctor} readOnly required />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Vascular Access:</label>
                      </td>
                      <td colSpan="3">
                        <input
                          type="text"
                          onChange={handleChange}
                          value={formData.Vascular}
                          name="Vascular"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Catheters:</label>
                      </td>
                      <td colSpan="3">
                        <input
                          type="text"
                          onChange={handleChange}
                          value={formData.Catheters}
                          name="Catheters"
                          required
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="form-group">
                  <label>PCI to LAD/LCX/RCA:</label>
                  <div className="paragraph">
                    <p>
                      LMS/RCA engaged with XB 3 JR 3.5{" "}
                      <input
                        type="text"
                        className="inline-input1"
                        name="catheter_type"
                        value={formData.catheter_type}
                        required
                        onChange={handleChange}
                      />{" "}
                      guiding catheter.{" "}
                    </p>
                    <p>
                      The LAD LCX RCA lesion was crossed with a Sion Blue/Floppy
                      guide wire.
                      <textarea
                        className="inline-input2"
                        type="text"
                        name="discription"
                        value={formData.discription}
                        onChange={handleChange}
                      ></textarea>
                    </p>
                    <p>
                      The lesion was pre-dilated with{" "}
                      <input
                        type="text"
                        required
                        className="inline-input3"
                        name="baloon_size"
                        onChange={handleChange}
                        value={formData.baloon_size}
                      />{" "}
                      SC/NC balloon at{" "}
                      <input
                        type="text"
                        required
                        className="inline-input4"
                        value={formData.baloon_presure}
                        name="baloon_presure"
                        onChange={handleChange}
                      />{" "}
                      atm.{" "}
                    </p>
                    <p>
                      The lesion was stented with a{" "}
                      <input
                        type="text"
                        required
                        className="inline-input5"
                        value={formData.stent_name}
                        name="stent_name"
                        onChange={handleChange}
                      />{" "}
                      DES at
                      <input
                        type="text"
                        required
                        className="inline-input6"
                        value={formData.stent_pressure}
                        name="stent_pressure"
                        onChange={handleChange}
                      />{" "}
                      atm.
                    </p>
                    <p>
                      Good final angiographic results with TIMI III flow were
                      achieved in LAD/LCX/RCA and branches.
                    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label>Recommendations:</label>
                  <div className="paragraph">
                    <p>Aspirin 75/150 mg for lifelong.</p>
                    <p>
                      Clopidogrel/Prasugrel/Ticagrelor based on physician's
                      prescription.
                    </p>
                  </div>
                </div>

                <div className="signature">
                  <p>{doctor}</p>
                </div>
                <button className="submit-report-button" onClick={handlesubmit}>
                  Save
                </button>
              </form>
            </div>
            <div className="form-container-patient-report form-image">
              {/* 2x2 Image Grid */}
              <img className="main-img" src={isimg} />

              <div className="filter-buttons">
                <button onClick={change1}>Equilize</button>
                <button onClick={change2}>Denoize</button>
                <button onClick={change3}>CLAHE</button>
                <button onClick={change4}>Frangi</button>
              </div>
              <div className="image-grid">
                <div className="image-cell">
                  <label>Image 1:</label>
                  <img
                    id="1"
                    src={images[0]}
                    alt="img1"
                    onClick={handleImageChange}
                  />
                </div>
                <div className="image-cell">
                  <label>Image 2:</label>
                  <img
                    id="2"
                    src={images[1]}
                    alt="img"
                    onClick={handleImageChange}
                  />
                </div>
                <div className="image-cell">
                  <label>Image 3:</label>
                  <img
                    id="3"
                    src={images[2]}
                    alt="img"
                    onClick={handleImageChange}
                  />
                </div>
                <div className="image-cell">
                  <label>Image 4:</label>
                  <img
                    id="4"
                    src={images[3]}
                    alt="img"
                    onClick={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div>
          <div className="printable-section">
            <AngiogramReportView
              rep_data={formData}
              pat_data={patient}
              image_files={images}
              doctor={doctor}
            />
          </div>
          <button onClick={handleback}>back</button>
          <button onClick={handlePrint}>print</button>
        </div>
      )}
    </div>
  );
}

export default Report;
