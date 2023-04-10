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
  const [assetTypeID, setAssetTypeID] = useState([]);
  const CostCenter = ["EY","PYP","MYP","DP"]
 // console.log(CostCenter)
  useEffect(() => {
    async function getAssetTypes() {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/assettypes`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const assettypesArray = await res.json();
    //  console.log(assettypesArray)
      setAssetTypeID(assettypesArray);
  }
  getAssetTypes();
  }, []);

  return (
    <Formik
      initialValues={{
        AssetNumber: '',
        SerialNumber: '',
        PurchaseValue: '',
        AssetTypeID: '',
        AssetDescription: '',
        CostCenter: ''
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, {resetForm}) => {
        console.log(values);
        await sleep(500);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/addNewDevice`, {
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
          <h4>Register new Device</h4>
          <div className="mb-3">
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
          </div>
          <button type="submit" className='btn btn-success'>Submit</button>
        </Form>
        
        </div>
      )}
    </Formik>
  );
};

export default AddMovement;
