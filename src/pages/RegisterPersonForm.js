import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navigation from '../components/Navigation';
import ListPersons from './ListPersons';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const RegisterPersonForm = ({token, logoutUser}) => {
  return (
    <Formik
      initialValues={{ FirstName: '', LastName: '' }}
      validationSchema={Yup.object({
        FirstName: Yup.string()
          .max(50, 'Must be 50 characters or less')
          .required('Required'),
        LastName: Yup.string()
          .max(50, 'Must be 50 characters or less')
          .required('Required'),
        // Email: Yup.string().email('Invalid email address').required('Required'),
      })}

      onSubmit={async (values, { resetForm }) => {
        console.log(values)
        await sleep(500);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/newPerson`, {
       method: "POST",
       headers: { "Content-type": "application/json",  'Authorization': `Bearer ${token}` },
       body: JSON.stringify(values),
     });
          alert(JSON.stringify(values, null, 2));
          resetForm(); //Resets the form data
      }}
          >
            <div className="container mt-5">
              <Navigation logoutUser={logoutUser}/>
      <Form>
      <h4>Register new Person</h4>

        <div className="mb-3">
          <label htmlFor="FirstName">First Name</label>
          <Field
            name="FirstName" type="text"
            className="form-control"
            placeholder="Enter firstname"
          />
          <ErrorMessage name="firstName" />
        </div>

        <div className="mb-3">
          <label htmlFor="LastName">Last Name</label>
          <Field
            name="LastName"
            type="text"
            className="form-control"
            placeholder="Enter lastname"
          />
          <ErrorMessage name="lastName" />
        </div>

        {/* <div className="mb-3">
          <label htmlFor="Email">Email Address</label>
          <Field
            name="Email"
            type="email"
            className="form-control"
            placeholder="Enter lastname"
          />
          <ErrorMessage name="email" />
        </div> */}

        <button
          type="submit"
          className="btn btn-primary"

        >Submit</button>
      </Form>
      <hr/>
      <ListPersons token={sessionStorage.getItem("accessToken")}/>
            </div>
    </Formik>
  );
};

export default RegisterPersonForm;