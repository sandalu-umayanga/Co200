import LoginForm from "../components/loginForm"
import Navbar from "../components/navbar"
import "../styls/homepage.css"

function Register(){
    return (
    <div>
        <Navbar />
        <LoginForm rout="api/user/register/" method="register" />
    </div>
    )
}

export default Register