
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import * as XLSX from 'xlsx'
import DataTable from 'react-data-table-component';
import { Button } from "react-bootstrap";
// import CircularJSON from 'circular-json'


const UploadExcel = ({logoutUser}) => {
  const columns = [
    {
      name: 'Asset Number',
      selector: row => row.assetnumber,
      sortable: true,
    },
    {
      name: 'Serial Number',
      selector: row => row.serialnumber,
      sortable: true,
    },
  
    {
      name: 'Asset Description',
      selector: row => row.assetdescription,
      sortable: true,
    },
    {
      name: 'Asset Type Name',
      selector: row => row.assettypename,
      sortable: true,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
    },
    {
      name: 'Purchase Date',
      selector: row => row.purchasedate,
      sortable: true,
      //  cell: (row) => row.PurchaseDate.substring(0, 10),
    },
    {
      name: 'Purchase Value',
      selector: row => row.purchasevalue,
      sortable: true,
    },
    {
      name: 'Cost Center',
      selector: row => row.costcenter,
      cell: row => (
        <select 
        className="form-select-sm"
        defaultValue={row.costcenter || ''}
          onChange={e => {
            const newCostCenter = e.target.value;
            const assetnumber = row.assetnumber;
            console.log(assetnumber)
            const updatedData = newAssets.map(d => {
            //  console.log('d.assetnumber:', d.assetnumber, 'row.assetnumber:', row.assetnumber);
              if (d.assetnumber === assetnumber) {
                return { ...d, costcenter: newCostCenter };
              }
              return d;
            });
            setNewAssets(updatedData);
            console.log(updatedData.slice(0,10))
          }}
        >
          <option value="" disabled={!row.costcenter}>Choose</option>
          <option value="EY">EY</option>
          <option value="PYP">PYP</option>
          <option value="MYP">MYP</option>
          <option value="DP">DP</option>
        </select>
      ),
    },
  ];

  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [totalCost,setTotalCost] = useState(null);
  const [newAssets,setNewAssets] = useState([]);
  const [pending, setPending] = useState(true);

  // const [payThisMonth,setPayThisMonth] = useState(0);

  // submit
  const [excelData, setExcelData] = useState([]);

  // handle File
  const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        setPending(true);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          setExcelFile(e.target.result);
        }
      }
      else {
        setExcelFileError('Please select only excel file types');
      //  setExcelFile(null);
      }
    }
    else {
      console.log('please select your file');
    }
  }

  useEffect((token) => {

    if (excelFile) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const slicedData = data.slice(15);
        
      const renamedExcelDataArray = slicedData.map((originalObj) => ({
        'assetnumber': originalObj['SFF-International School of Helsingborg'],
        'serialnumber': originalObj['__EMPTY'],
        'assetdescription': originalObj['__EMPTY_6'],
        'assettypename': originalObj['__EMPTY_4'],
        'location': originalObj['__EMPTY_13'],
        'purchasedate': originalObj['__EMPTY_8'],
        'purchasevalue': originalObj['__EMPTY_7'],
        'totalcost': originalObj['__EMPTY_21'],
      }));
  
      const updatedObjects = renamedExcelDataArray.map(object => {
        const unixTimestamp = (object.purchasedate - 25569) * 86400 * 1000;
        const purchaseDate = new Date(unixTimestamp);
        const formattedDate = purchaseDate.toISOString().split('T')[0];

        return {
          ...object,
          purchasedate: formattedDate,
        };
      }

      );
  
      const totalCost = updatedObjects.reduce((acc, asset) => {
        if (asset && asset.totalcost) {
          const costString = String(asset.totalcost).replace(',', '.').replace(/\s/g, '');
          const cost = parseFloat(costString);
          if (!isNaN(cost)) {
            return acc + cost;
          }
        }
        return acc;
      }, 0);
//      console.log(totalCost)

      setExcelData(updatedObjects);
      setTotalCost(totalCost);
//      console.log(totalCost)

const batchSize = 20; // Number of objects to send in each batch
const numBatches = Math.ceil(updatedObjects.length / batchSize);
console.log("numbatches :", numBatches)

 //const assets = updatedObjects
 //console.log("assets", assets)

 fetch(`${process.env.REACT_APP_BACKEND_URL}/truncateMonthlyUpload`, {
  method: "POST",
  headers: {
    "Content-type": "application/json", 'Authorization': `Bearer ${token}`, 
  }
});



//this is where the data is passed to the server
const uploadBatch = async (batch) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/monthlyupload`, {
      method: "POST",
      headers: {
        "Content-type": "application/json", 'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(batch),
    });

   // console.log(response)
    if (!response.ok) {
      throw new Error("Upload failed");
    }
    console.log(`Batch uploaded successfully`);

  } catch (error) {
    console.error(error);
  }
};

const updateAssetsTable = async () => {
  console.log("updating assetstable")
 
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/showNewAssets`, {
    headers: {
        'Authorization': `Bearer ${token}`,                    
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',                
    }
});
const newAssets = await res.json();
  const timeout = setTimeout(() => {
    setNewAssets(newAssets);
    setPending(false);

    // deleting unmatched assets
    
  }, 2000);

//  const result =  await fetch(`${process.env.REACT_APP_BACKEND_URL}/truncateAssetsNotInSpreadsheet`, {
//    method: "DELETE",
//    headers: {
//        'Authorization': `Bearer ${token}`,                    
//        'Access-Control-Allow-Origin': '*',
//        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',                
//    }
});
 const removingAssets = await result.json()
 console.log("removing : ", removingAssets)
 
  return () => clearTimeout(timeout)

  
}

const uploadData =  () => {
  for (let i = 0; i < numBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, updatedObjects.length);
    const batch = updatedObjects.slice(start, end);
   // const batch = JSON.stringify(batch2)
   // console.log(batch)

     batch.forEach( async (object) => await uploadBatch(object));


  }
  updateAssetsTable()
  console.log("done!")
};

uploadData();


    }
  }, [excelFile]);
  
   // monthlyUploadToAssets
   const submit = async (token) => {
   // console.log("break down assets as with the monthlyupload")
   console.log(newAssets);
   try {
    const assettypeMapping = {
      Mobiltelefon: 10,
      Chromebook: 6,
      "Bärbar dator": 4,
      Dockingsenhet: 18,
      Bildskärm: 13,
      Skanner: 11,
    }

    const updatedAssets = newAssets.map((object) => {
      const assetTypeID = assettypeMapping[object.assettypename];
      if(assetTypeID) {
        return {...object, assetTypeID}
      } else {
        return object
      }
    })

    updatedAssets.forEach( async (object) =>  await fetch(`${process.env.REACT_APP_BACKEND_URL}/monthlyUploadToAssets`, {
      method: "POST",
      headers: {
        "Content-type": "application/json", 'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(object),
    }));

   // console.log(response)
    // if (!response.ok) {
    //   throw new Error("Upload failed");
    // }
    console.log(newAssets);

  } catch (error) {
    console.error(error);
  } 
  }


    
  return (
    <div className="container mt-5">
      <Navigation logoutUser={logoutUser} />


      <form className='form-group' autoComplete="off"
        >
        <label><h5>Upload Excel file</h5></label>
        <br></br>
        <input type='file' className='form-control'
          onChange={handleFile} required></input>
          <br></br>
        {excelFileError && <div className='text-danger'
          style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
        {/* <button type='submit' className='btn btn-success'
          style={{ marginTop: 5 + 'px' }}>Submit</button> */}
      </form>

<>
      {totalCost && 
      <div className="d-flex justify-content-between container mt-5">
       {/* <div className="d-flex justify-content-between align-items-center container mt-5"> */}
      <h4>To pay this month: {totalCost} SEK</h4>    

      </div>

      }


{excelFile && <DataTable
        title="New Devices"
        defaultSortFieldId="PurchaseDate"
        defaultSortAsc={false}
       // pagination
        progressPending={pending}
        columns={columns}
        data={newAssets}
        selectableRowsHighlight
        highlightOnHover
        // onSelectedRowsChange={handleSelected}
        // contextActions={contextActions}
        // clearSelectedRows={toggleCleared}
        responsive
      />}
      
      </>     
     
      <div className="d-grid gap-2 col-6 mx-auto">
       
     {!pending && newAssets.length > 0 && <Button variant="success" className="btn-lg" onClick={submit}>Add</Button> 
    }
      </div>


  

<hr />
</div>
  )
}

export default UploadExcel
