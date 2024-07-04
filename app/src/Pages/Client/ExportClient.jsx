import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
 // Import axios for making HTTP requests
// Import file-saver for triggering file download
import '../../App.css';
import { Button } from '@mui/material';
// import {apiExportClient} from '../../api/clientsApi'

function ExportClient({selectedFields,onClose,setSelectedFields}) {
  // const [selectedFields, setSelectedFields] = useState({
  //   Name: false,
  //   Email: false,
  //   Phone: false,
  //   'Address 1': false,
  //   'Address 2': false,
  //   City: false,
  //   'State/Province': false,
  //   'Zip/Portal': false,
  //   'Country ID': false,
  //   Country: false,
  //   Archived: false,
  //   'Estimates Count': false,
  //   'Invoices Count': false,
  //   'Summary Data': false,
  // });
  

  const handleCheckboxChange = (fieldName) => {
    setSelectedFields((prevFields) => ({
      ...prevFields,
      [fieldName]: !prevFields[fieldName],
    }));
  };

  const handleSelectAll = () => {
    const allFieldsSelected = {};
    for (const key in selectedFields) {
      allFieldsSelected[key] = true;
    }
    setSelectedFields(allFieldsSelected);
    
  };
  console.log(selectedFields);
  const handleUnselectAll = () => {
    const allFieldsUnselected = {};
    for (const key in selectedFields) {
      allFieldsUnselected[key] = false;
    }
    setSelectedFields(allFieldsUnselected);
  };



  return (
    <div className="exportPage">
      <div className="heading">
        <h2 className="heading">Download Fields</h2>
        <button onClick={onClose} color='primary'>
          <CloseIcon />
        </button>
      </div>

      <div className="paragraph">
        <p className="paragraph">Select the fields to include</p>
      </div>
      <div className="select-unselect">
        <button className="unselect" onClick={handleUnselectAll}>
          Unselect all
        </button>
        <button className="select" onClick={handleSelectAll}>
          Select all
        </button>
      </div>
      <div className="Form">
        <form action="">
          <div className="checkboxes">
            {Object.entries(selectedFields).map(([fieldName, checked,showfield]) => (
              <div key={fieldName}>
                <input
                  type="checkbox"
                  value={fieldName}
                  checked={checked}
                  onChange={() => handleCheckboxChange(fieldName)}
                />
                <label htmlFor={fieldName}>{fieldName}</label>
                
              </div>
            ))}
          </div>
        </form>
      </div>
      <div style={{textAlign:'right'}} >
        <Button onClick={onClose} variant="contained" color='primary'>Close</Button>
      </div>
      <div className="Download">
        
      </div>
    </div>
  );
}

export default ExportClient;