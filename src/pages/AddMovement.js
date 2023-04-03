import React, { useState, useEffect } from "react";
import { Typeahead } from 'react-bootstrap-typeahead';
import Navigation from "../components/Navigation";

const AddMovement = ({token}) => {

  const [persons, setPersons] = useState([]);
  const [chosenPerson, setChosenPerson] = useState([]);
  const [devices, setDevices] = useState([]);
  const [chosenDevice, setChosenDevice] = useState([]);  
  const [notUsed,setNotUsed] = useState([])

  //get all registered persons
  useEffect(() => {
    async function fetchPersons() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/persons`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      const data = await response.json();
      setPersons(data);
    }

    async function fetchDevices() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/allAssets`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      const data = await response.json();
      setDevices(data);
    }


    fetchPersons();
    fetchDevices();
  }, []);

  const submit = () => {
    const chosenPersonID = JSON.stringify(chosenPerson[0].personID)
    const chosenDeviceID = JSON.stringify(chosenDevice[0].ID)
    const data = {chosenPersonID, chosenDeviceID}
    fetch(`${process.env.REACT_APP_BACKEND_URL}/newMovement/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    alert(JSON.stringify(data, null, 2));

  };

  return (
    <>
      <form className="container mt-5">
      <Navigation />
      <h4>Add New Movement</h4>
        <div className="mb-3">
          <label htmlFor="Person">Choose Person</label>
          <Typeahead
            name="Person"
            id="basic-typeahead-single"
            labelKey={option => `${option.full_name}`}
            onChange={setChosenPerson}
            options={persons}
            placeholder="Choose a person..."
            selected={chosenPerson}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Assetnumber">Enter Assetnumber</label>
          <Typeahead
            name="Assetnumber"
            id="basic-typeahead-single"
            labelKey={option => `${option.AssetNumber}`}
            onChange={setChosenDevice}
            options={devices}
            placeholder="enter the assetnumber..."
            selected={chosenDevice}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="SerialNumber">Enter Serialnumber</label>
          <Typeahead
            name="Serialnumber"
            id="basic-typeahead-single"
            labelKey={option => `${option.SerialNumber}`}
            onChange={setChosenDevice}
            options={devices}
            placeholder="enter the serialNumber..."
            selected={chosenDevice}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="AssetType">Device Type</label>
          <Typeahead
            disabled
            name="AssetType"
            id="basic-typeahead-single"
            labelKey={option => `${option.AssetType}`}
            onChange={setNotUsed}
            options={devices}
            placeholder="enter the serialNumber..."
            selected={chosenDevice}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="CostCenter">Cost Center</label>
          <Typeahead
            disabled
            name="CostCenter"
            id="basic-typeahead-single"
            labelKey={option => `${option.CostCenter}`}
            onChange={setNotUsed}
            options={devices}
            placeholder="CostCenter"
            selected={chosenDevice}
          />
        </div>


        <button
          type="submit"
          className="btn btn-primary"
          onClick={submit}
        >Submit</button>
      </form>
    </>
  )
};


export default AddMovement;