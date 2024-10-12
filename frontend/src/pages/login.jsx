import LoginForm from "../components/loginForm"

function Login(){
    return <LoginForm rout="/api/token/" method="login"/>
}

export default Login