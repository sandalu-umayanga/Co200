import React, { useState } from 'react';
import api from "../api"  // Importing the API instance for making requests
import "../styls/uploadimg.css"  // Importing the CSS file for styling the ImageUpload component

function ImageUpload() {
  // State variables to handle hospital ID, image files, error, and success messages
  const [hosId, setHosId] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle change in hospital ID input field
  const handleHosIdChange = (e) => {
    setHosId(e.target.value);
  };

  // Handle change in image file input
  const handleImageChange = (e) => {
    setImages(e.target.files);  // Set the selected image files to state
  };

  // Handle form submission to upload images
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    // Check image list is null.
    if (images.length == 0){
      setError("Upload Images");
      setSuccess(null)
      return;
    }

    // Create a new FormData object to append the files and hospital ID for submission
    const formData = new FormData();
    formData.append('hos_id', hosId);

    // Append each selected image to the formData object
    for (let i = 0; i < images.length; i++) {
      formData.append('report_img', images[i]);
    }

    try {
      // Send the form data to the backend API for image upload
      const response = await api.post('/api/upload-images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Set content type for file upload
        },
      });

      // Check if the response contains an error
      if (response.data.err){
        setError(response.data.err);  // Set the error message if present
      }
      else{
        alert("ok");  // Alert message for successful upload (optional)
        setSuccess(`Images uploaded successfully for hospital ID ${hosId}!`);  // Set success message
        setError(null);  // Clear any existing error message
        setImages([]);  // Clear the selected images after upload
      }
    } catch (err) {
      // Handle any errors during the image upload process
      setError('Error uploading images.');  // Set error message
      setSuccess(null);  // Clear any success message in case of an error
    }
  };

  return (
    <div className='image-upload-page'>
      <h2>Upload Images</h2>
      <form onSubmit={handleSubmit} className='image-upload-form'>
        {/* Input field for Hospital ID */}
        <div>
          <label>Hospital ID:</label>
          <input type="text" value={hosId} onChange={handleHosIdChange} required />
        </div>

        {/* Input field for selecting multiple image files */}
        <div>
          <label>Upload Images:</label>
          <input type="file" multiple onChange={handleImageChange} accept="image/*" />
        </div>

        {/* Display error message if there's an error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display success message if images are uploaded successfully */}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Submit button to trigger the upload */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ImageUpload;
