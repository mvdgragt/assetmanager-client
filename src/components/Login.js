const Login = ({signInwithGoogle}) => {
    return(
<div className="d-flex align-items-center justify-content-center"  style={{ height: '100vh' }}>
    <div className="mx-auto text-center">
    <h1>ISH Assetmanager</h1>
     <button className="btn btn-primary" onClick={signInwithGoogle}><h1>login</h1></button>
  </div>
</div>

    )
}

export default Login;

//user={user}