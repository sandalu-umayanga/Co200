import React, { useState } from 'react';
import api from "../api"
import "../styls/uploadimg.css"

function ImageUpload() {
  const [hosId, setHosId] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleHosIdChange = (e) => {
    setHosId(e.target.value);
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('hos_id', hosId);

    if (images.length == 0)
    {
      setError("NO IMAGES SELECTED")
      return;
    }


    for (let i = 0; i < images.length; i++) {
      formData.append('report_img', images[i]);
    }

    try {
      const response = await api.post('/api/upload-images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.err){
        setError(response.data.err)
      }
      else{
        setSuccess(`Images uploaded successfully for hospital ID ${hosId}!`);
        setError(null);
        setImages([]);
      }
    } catch (err) {
      setError('Error uploading images.');
      setSuccess(null);
    }
  };

  return (
    <div className='image-upload-page'>
      <h2>Upload Images</h2>
      <form onSubmit={handleSubmit} className='image-upload-form'>
        <div>
          <label>Hospital ID:</label>
          <input type="text" value={hosId} onChange={handleHosIdChange} required />
        </div>
        <div>
          <label>Upload Images:</label>
          <input type="file" multiple onChange={handleImageChange} accept="image/*" />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ImageUpload;
