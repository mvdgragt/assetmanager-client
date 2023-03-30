
import React, { useState } from 'react';
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
    name: 'Cost Center',
    selector: row => row.costcenter,
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

  // submit
  const [excelData, setExcelData] = useState([]);


  // it will contain array of objects

  // handle File
  const fileType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
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
        setExcelFile(null);
      }
    }
    else {
      console.log('please select your file');
    }
  }

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const slicedData = data.slice(15)

//setExcelData(slicedData)
//console.log(data)

      const renamedExcelDataArray = slicedData.map((originalObj) => ({
        'assetnumber': originalObj['SFF-International School of Helsingborg'],
        'serialnumber': originalObj['__EMPTY'],
        'assetdescription': originalObj['__EMPTY_6'],
        'assettypename': originalObj['__EMPTY_4'],
        'costcenter': originalObj['__EMPTY_13'],
        'purchasedate': originalObj['__EMPTY_8'],
        'purchasevalue': originalObj['__EMPTY_7'],

      }));

      setExcelData(renamedExcelDataArray)
      // console.log("renamedData :", renamedExcelDataArray)
      return (
        renamedExcelDataArray
      )
    }
    else {
      setExcelData([]);
    }
  }

  return (
    <div className="container mt-5">
      <Navigation logoutUser={logoutUser} />


      <form className='form-group' autoComplete="off"
        onSubmit={handleSubmit}>
        <label><h5>Upload Excel file</h5></label>
        <br></br>
        <input type='file' className='form-control'
          onChange={handleFile} required></input>
        {excelFileError && <div className='text-danger'
          style={{ marginTop: 5 + 'px' }}>{excelFileError}</div>}
        <button type='submit' className='btn btn-success'
          style={{ marginTop: 5 + 'px' }}>Submit</button>
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

    </div>
  )
}

export default UploadExcel
