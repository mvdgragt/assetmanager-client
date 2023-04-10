import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Navigation from '../components/Navigation';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


const validationSchema = Yup.object().shape({
  AssetNumber: Yup.string().required('Asset number is required'),
  SerialNumber: Yup.string().required('Serial number is required'),
  PurchaseValue: Yup.number().required('Purchase Value is required'),
  AssetTypeID: Yup.number().required('Asset Type is required'),
  AssetDescription: Yup.string().required('Asset Description  is required'),
  CostCenter: Yup.string().required('Cost Center is required'),
});

const AddMovement = ({token, logoutUser}) => {
    const [chosenPerson, setChosenPerson] = useState([]);
    const [chosenDevice, setChosenDevice] = useState([]);  
  useEffect(() => {
    async function getPersons() {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/persons`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const personsArray = await res.json();
    //  console.log(personsArray)
    setChosenPerson(personsArray);
  }

  async function getDevices() {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/allAssets`, {

      headers: {
          'Authorization': `Bearer ${token}`
      }
  });
    const devicesArray = await response.json();
    // console.log(devicesArray)
    setChosenDevice(devicesArray);
  }
  getPersons();
  getDevices();
  }, []);

  return (
    <Formik
      initialValues={{
        ChosenPerson: '',
        ChosenDevice: ''
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, {resetForm}) => {
        console.log(values);
        await sleep(500);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/newMovement`, {
          method: "POST",
          headers: { "Content-type": "application/json", 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(values),
        });
        alert(JSON.stringify(values, null, 2));
                  console.log(values);
        resetForm(); //Resets the form data
        // submit logic here
      }}
    >
      {({ errors, touched }) => (
        <div className="container mt-5">
          <Navigation logoutUser={logoutUser}/>
        <Form>
          <h4>Add New Movement</h4>


{/* choose person */}
          <div className="mb-3">
            <label htmlFor="chosenPerson">Choose Person</label>
            <Field  className="form-control" name="ChosenPerson" as="select">
              <option value="">Choose a person...</option>
              {chosenPerson.map((option) => (
                <option key={option.ID} value={option.ID}>
                  {option.full_name}
                </option>
              ))}
            </Field>
            {errors.ChosenPerson && touched.ChosenPerson ? (
              <div>{errors.ChosenPerson}</div>
            ) : null}
          </div>

{/* choose device */}
<div className="mb-3">
            <label htmlFor="chosenDevice">Enter Assetnumber</label>
            <Field  className="form-control" name="ChosenDevice" as="select">
              <option value="">enter the assetnumber...</option>
              {chosenDevice.map((option) => (
                <option key={option.ID} value={option.ID}>
                  {option.AssetNumber}
                </option>
              ))}
            </Field>
            {errors.ChosenDevice && touched.ChosenDevice ? (
              <div>{errors.ChosenDevice}</div>
            ) : null}
          </div>


          {/* <div className="mb-3">
            <label htmlFor="AssetNumber">Asset Number</label>
            <Field className="form-control" name="AssetNumber" />
            {errors.AssetNumber && touched.AssetNumber ? (
              <div>{errors.AssetNumber}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="SerialNumber">Serial Number</label>
            <Field  className="form-control" name="SerialNumber" />
            {errors.SerialNumber && touched.SerialNumber ? (
              <div>{errors.SerialNumber}</div>
            ) : null}
          </div>

          <div className="mb-3">
          <label htmlFor="PurchaseValue">Purchase Value</label>
          <Field
            name="PurchaseValue"
            type="number"
            className="form-control"
            placeholder="Enter Purchase Value"
          />
           {errors.PurchaseValue && touched.PurchaseValue ? (
              <div>{errors.PurchaseValue}</div>
            ) : null}
        </div>


          <div className="mb-3">
            <label htmlFor="assetTypeID">Asset Type</label>
            <Field  className="form-control" name="AssetTypeID" as="select">
              <option value="">Choose asset type</option>
              {assetTypeID.map((option) => (
                <option key={option.ID} value={option.ID}>
                  {option.AssetType}
                </option>
              ))}
            </Field>
            {errors.AssetTypeID && touched.AssetTypeID ? (
              <div>{errors.AssetTypeID}</div>
            ) : null}
          </div>

          <div className="mb-3">
          <label htmlFor="AssetDescription">Asset Description</label>
          <Field
            name="AssetDescription"
            type="text"
            className="form-control"
            placeholder="Enter Asset Description"
          />
           {errors.AssetDescription && touched.AssetDescription ? (
              <div>{errors.AssetDescription}</div>
            ) : null}
        </div>


          <div className="mb-3">
            <label htmlFor="CostCenter">Cost Center</label>
            <Field  className="form-control" name="CostCenter" as="select">
              <option value="">Choose costcenter</option>
              {CostCenter.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
            {errors.CostCenter && touched.CostCenter ? (
              <div>{errors.CostCenter}</div>
            ) : null}
          </div> */}
          <button type="submit" className='btn btn-success'>Submit</button>
        </Form>
        
        </div>
      )}
    </Formik>
  );
};

export default AddMovement;
