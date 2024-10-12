import React from "react";
import { useNavigate } from "react-router-dom";
import "../styls/profile.css";

export default function Profile(props) {
    const { user_data, user_image, user_age } = props;
    const [data, setData] = React.useState(user_data);
    const [image, setImage] = React.useState(user_image);
    const [age, setAge] = React.useState(user_age);
    const navigate = useNavigate();

    React.useEffect(() => {
        setData(user_data);
        setImage(user_image);
        setAge(user_age);
    }, [user_data, user_image, user_age]);

    function handlepic() {
        if (props.istrue){
            navigate("/profile/pic");
        }  
    }

    return (
        <div className="prof-container">
            {image && <img src={image} className="prof-pic-image" onClick={handlepic} />}
            <div className="prof-details">
                {data && (
                    <>
                        <p className="prof-name prof-detail">{data.name}</p>
                        <p className="prof-profe prof-detail">Profession: {data.profecion}</p>
                        <p className="prof-age prof-detail">Age: {age}</p>
                        <p className="prof-contact prof-detail">Contact: {data.contact}</p>
                        <p className="prof-email prof-detail">Email: {data.email}</p>
                        <p className="prof-spec prof-detail">Speciality: {data.specility}</p>
                    </>
                )}
            </div>
        </div>
    );
}
