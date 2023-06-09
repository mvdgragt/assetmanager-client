// This Component renders all the items that are loaned out to someone

import React, { useEffect, useState, useCallback, useMemo } from "react";
import DataTable from 'react-data-table-component';

const ListMovements = () => {

const columns = [
    {
        name: 'Asset Number',
        selector: row => row.AssetNumber,
        sortable: true,

    },
    {
        name: 'Serial Number',
        selector: row => row.SerialNumber,
        sortable: true,

    },
    {
        name: 'Asset Type Name',
        selector: row => row.AssetType,
        sortable: true,

    },
];

const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [selectedRows, setSelectedRows] = useState([])
const [toggleCleared, setToggleCleared] = useState(false);

    // getMovements()
    
   useEffect(() => {
        async function getMovements() {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/notonloan`);
            const movementsArray = await res.json();
            setData(movementsArray);
        }
        getMovements();
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

selectedRows.forEach(e => 
    fetch(`${process.env.REACT_APP_BACKEND_URL}/updates/${e.SerialNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
    })
)
        if (window.confirm(`Are you sure you want to book in the following?:\n ${selectedRows.map(r => r.full_name).join('\n')}`)) {
        setSelectedRows(selectedRows)
        setToggleCleared(!toggleCleared); }
      }, [selectedRows, setSelectedRows, toggleCleared, setToggleCleared]);
      

       useEffect(() => {
         filterData(searchTerm);
       }, [searchTerm, filterData]);
       
    

    const contextActions = useMemo(() => {
 
    return(
        <button className="btn btn-danger" onClick = {submitButton } style={{ backgroundColor: 'red' }}>
				Book In
			</button>
    )
    },[submitButton])

    return (
        <div className="container mt-5">
            <header>
            <input type="text"  className="form-control" placeholder="Filter..." onChange={handleSearch} />           

</header>
            <DataTable
            title="All Devices on Loan"
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

export default ListMovements;