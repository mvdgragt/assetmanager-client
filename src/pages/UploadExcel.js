
import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import * as XLSX from 'xlsx'
import DataTable from 'react-data-table-component';

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
];



const UploadExcel = ({ token, logoutUser }) => {
  // on change states
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileError, setExcelFileError] = useState(null);
  const [totalCost,setTotalCost] = useState(null)
  const [payThisMonth,setPayThisMonth] = useState(0);

  // submit
  const [excelData, setExcelData] = useState([]);

  // handle File
  const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
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

  useEffect(() => {
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
          purchasedate: formattedDate
        };
      });
  
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
    }
  }, [excelFile]);
  
  return (
    <div className="container mt-5">
      <Navigation logoutUser={logoutUser} />


      <form className='form-group' autoComplete="off"
        >
        <label><h5>Upload Excel file</h5></label>
        <br></br>
        <input type='file' className='form-control'
          onChange={handleFile} required></input>
        {excelFileError && <div className='text-danger'
          style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
        {/* <button type='submit' className='btn btn-success'
          style={{ marginTop: 5 + 'px' }}>Submit</button> */}
      </form>

      <DataTable
        title="All Devices from File Upload"
        defaultSortFieldId={6}
        defaultSortAsc={false}
        pagination
        columns={columns}
        data={excelData}
        selectableRows
        selectableRowsHighlight
        // onSelectedRowsChange={handleSelected}
        // contextActions={contextActions}
        // clearSelectedRows={toggleCleared}
        responsive
      />

<hr />
{totalCost && <h4>To pay this month: {totalCost} SEK</h4>}    </div>
  )
}

export default UploadExcel
