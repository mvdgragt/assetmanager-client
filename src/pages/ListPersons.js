// This Component renders all the items that are loaned out to someone

import React, { useEffect, useState, useCallback, useMemo } from "react";
import DataTable from 'react-data-table-component';

const ListPersons = ({token}) => {

const columns = [
    {
        name: 'Full Name',
        selector: row => row.full_name,
        sortable: true,
    },

    {
        name: 'Email',
        selector: row => row.Email,
        sortable: true,

    },
];

const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [selectedRows, setSelectedRows] = useState([])
const [toggleCleared, setToggleCleared] = useState(false);
  
   useEffect(() => {
        async function getPersons() {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/persons`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const personsArray = await res.json();
            setData(personsArray);
        }
        getPersons();
    }, [toggleCleared]);

    const filterData = useCallback((searchTerm) => {
        const filtered = data.filter((item) => {
            const values = Object.values(item).join('').toLowerCase();
            return values.includes(searchTerm.toLowerCase());
          });

        setFilteredData(filtered);
      },[data]);

      const [searchTerm, setSearchTerm] = useState('');

      const handleSearch = (event) => {
        setSearchTerm(event.target.value);
      };
      
      const handleSelected = ({selectedRows}) => {
        setSelectedRows(selectedRows)
        
    };

    const submitButton = useCallback(() => {
console.log(selectedRows)
selectedRows.forEach(e => 
    fetch(`${process.env.REACT_APP_BACKEND_URL}/persons/${e.ID}`, {
        method: "DELETE",
        headers: {'Authorization': `Bearer ${token}`
    },
    })
)
        if (window.confirm(`Are you sure you want to delete the following?:\n ${selectedRows.map(r => r.full_name).join('\n')}`)) {
        setSelectedRows(selectedRows)
        setToggleCleared(!toggleCleared); }
      }, [selectedRows, setSelectedRows, toggleCleared, setToggleCleared]);
      

       useEffect(() => {
         filterData(searchTerm);
       }, [searchTerm, filterData]);
       
    

    const contextActions = useMemo(() => {
 
    return(
        <button className="btn btn-danger" onClick = {submitButton } style={{ backgroundColor: 'red' }}>
				Delete
			</button>
    )
    },[submitButton])

    return (
        <div className="container mt-5">
            <header>
            <input type="text"  className="form-control" placeholder="Filter..." onChange={handleSearch} />           

</header>
            <DataTable
            title="All Users"
            defaultSortFieldId={1}
            pagination
            columns={columns}
            data={filteredData}
            selectableRows
            selectableRowsHighlight
            onSelectedRowsChange={handleSelected}
            contextActions={contextActions}
            clearSelectedRows={toggleCleared}
            responsive
            />
        </div>

    )
};

export default ListPersons;