import React, { useEffect, useRef, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (isCameraActive) {
      // Access the user's camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Set the video element's source to the camera stream
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error('Error accessing the camera: ', err);
        });
    }
    return () => {
      // Clean up the video stream when the component unmounts or camera turns off
      if (videoRef.current && videoRef.current.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();

        tracks.forEach(function(track) {
          track.stop();
        });
      }
    };
  }, [isCameraActive]);

  return (
    <div>
      <h1>Camera Access</h1>
      <button onClick={() => setIsCameraActive(!isCameraActive)}>
        {isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <div>
        <video ref={videoRef} autoPlay width="640" height="480" />
      </div>
    </div>
  );
};

export default CameraComponent;
