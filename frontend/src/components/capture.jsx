import React, { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
  // Reference to the video element in the DOM
  const videoRef = useRef(null);

  // State to manage whether the camera is active or not
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (isCameraActive) {
      // If the camera is activated, access the user's camera
      navigator.mediaDevices
        .getUserMedia({ video: true }) // Request video stream from the user's camera
        .then((stream) => {
          // Assign the camera stream to the video element's source
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          // Log any error that occurs while accessing the camera
          console.error('Error accessing the camera: ', err);
        });
    }

    // Cleanup function to stop the camera stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject; // Get the active video stream
        let tracks = stream.getTracks(); // Retrieve all tracks (audio/video)

        // Stop each track to release the camera
        tracks.forEach(function(track) {
          track.stop();
        });
      }
    };
  }, [isCameraActive]); // Re-run the effect whenever the camera activation state changes

  return (
    <div>
      <h1>Camera Access</h1>
      {/* Button to toggle the camera on/off */}
      <button onClick={() => setIsCameraActive(!isCameraActive)}>
        {isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <div>
        {/* Video element to display the camera stream */}
        <video ref={videoRef} autoPlay width="640" height="480" />
      </div>
    </div>
  );
};

export default CameraComponent;
// The CameraComponent is a React functional component that demonstrates how to access the
// user's camera using the getUserMedia API. The component includes a video element to display 
// the camera stream and a button to toggle the camera on and off.
