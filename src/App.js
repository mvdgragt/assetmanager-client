import "./config/firebase-config"
import { Routes, Route } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithPopup,signOut  } from "firebase/auth";
import "./App.css";
import React, {useState, Fragment} from 'react';
import ListMovements from './pages/ListMovements';
import RegisterPersonForm from './pages/RegisterPersonForm';
import AddMovement from './pages/AddMovement'
import RegisterDeviceForm from "./pages/RegisterDeviceForm";
import ListAssets from "./pages/ListAssets";
import Login from "./components/Login";
import UploadExcel from "./pages/UploadExcel";

function App() {

  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  const auth = getAuth();

  const [authorizedUser,setAuthorizedUser] = useState(false || sessionStorage.getItem("accessToken"));

  const signInwithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // Access token of user
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
       // setUser(user)
        console.log("user :",user.displayName)
        console.log("token :", token)
        // if(user){
        //   user.getIdToken().then((tkn)=>{
        //     // set access token in session storage
        //     sessionStorage.setItem("accessToken", tkn);
        //     setAuthorizedUser(true);
        //   })
        // }
        // Refresh token logic
      user.getIdToken(/* forceRefresh */ true).then((tkn)=>{
        // set access token in session storage
        sessionStorage.setItem("accessToken", tkn);
        setAuthorizedUser(true);
      })


        //Assign who is allowed to login
        if(  
        user.email.endsWith("miva1000@utb.helsingborg.se") ||
        user.email.endsWith("katrinasblogg@gmail.com") ||
        user.email.endsWith("sivi1000@utb.helsingborg.se")

        
        ){
          user.getIdToken().then((tkn)=>{
            // set access token in session storage
            sessionStorage.setItem("accessToken", tkn);
            setAuthorizedUser(true);
          })
        }


      })
  }
  const logoutUser = () => {
    signOut(auth).then(() => {      
      // clear session storage
      sessionStorage.clear();
      setAuthorizedUser(false);
      window.location.replace("/");
      alert('Logged Out Successfully');
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }
  return (
    <Routes token={sessionStorage.getItem("accessToken")}>
     {authorizedUser ? (
        <>
          {/* <p>Welcome {user.displayName}</p>
          <button onClick={logoutUser}>Logout Button</button> */}

      <Route path="/" element={<ListMovements token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
      <Route path="/persons" element={<RegisterPersonForm token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
      <Route path="/devices" element={<RegisterDeviceForm token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
      <Route path="registermovement" element={<AddMovement token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
      <Route path="/listassets" element={<ListAssets token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
      <Route path="/excelupload" element={<UploadExcel token={sessionStorage.getItem("accessToken")} logoutUser={logoutUser}/>} />
  
        </>
      ): (
        
        <Route path="/" element={<Login signInwithGoogle={signInwithGoogle}/> } />
        
      )}
    </Routes>
  );
}

export default App;
