import './App.css';
import React, {Fragment} from 'react';
import ListMovements from './components/ListMovements';
import RegisterPersonForm from './components/RegisterPersonForm';
import ListPersons from './components/ListPersons';
import AddMovement from './components/AddMovement'

function App() {
  return (
    <Fragment>
       <ListMovements />
      <hr />
      <RegisterPersonForm />
      <hr />
      <ListPersons />
      <hr />
      <AddMovement />
    </Fragment>
  );
}

export default App;
