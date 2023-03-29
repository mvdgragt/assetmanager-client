// This Component renders all the items that are loaned out to someone

import React, { useEffect, useState, useCallback, useMemo } from "react";
import DataTable from 'react-data-table-component';
import Navigation from "../components/Navigation";

const ListAssets = ({token, logoutUser}) => {

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
        name: 'Asset Description',
        selector: row => row.AssetDescription,
        sortable: true,
    },
    {
        name: 'Asset Type Name',
        selector: row => row.AssetType,
        sortable: true,

    },
    {
        name: 'Cost Center',
        selector: row => row.CostCenter,
        sortable: true,

    },
    {
        name: 'Purchase Date',
        selector: row => row.PurchaseDate,
        sortable: true,
        cell: (row) => row.PurchaseDate.substring(0, 10),
    },
    {
        name: 'Purchase Value',
        selector: row => row.PurchaseValue,
        sortable: true,
    },
  
];

const [data, setData] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [selectedRows, setSelectedRows] = useState([])
const [toggleCleared, setToggleCleared] = useState(false);

    // getMovements()
    
   useEffect(() => {
        async function getAssets() {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/allAssets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const assetssArray = await res.json();
            setData(assetssArray);
        }
        getAssets();
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
            fetch(`${process.env.REACT_APP_BACKEND_URL}/deleteasset/${e.SerialNumber}`, {
                method: "DELETE",
                headers: 
                {   "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
            })
        )
                if (window.confirm(`Are you sure you want to delete the asset with the following serialnumber?:\n ${selectedRows.map(r => r.SerialNumber).join('\n')}`)) {
                setSelectedRows(selectedRows)
                setToggleCleared(!toggleCleared); }
              }, [selectedRows, setSelectedRows, toggleCleared, setToggleCleared, token]);
              
        
               useEffect(() => {
                 filterData(searchTerm);
               }, [searchTerm, filterData]);
               
            
        
            const contextActions = useMemo(() => {
         
            return(
                <button className="btn btn-danger" onClick = {submitButton } style={{ backgroundColor: 'red' }}>
                        DELETE
                    </button>
            )
            },[submitButton])


    return (
        <div className="container mt-5">
            <Navigation logoutUser={logoutUser}/>
            <header>
            <input type="text"  className="form-control" placeholder="Filter..." onChange={handleSearch} />           

</header>
            <DataTable
            title="All Devices"
            defaultSortFieldId={6}
            defaultSortAsc={false}
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

export default ListAssets;