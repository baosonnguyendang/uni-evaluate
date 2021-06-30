import React, { useState, useEffect } from 'react'

import { Tooltip, IconButton, Box} from '@material-ui/core'
import PrintIcon from '@material-ui/icons/Print';

export default function PrintList() {

  function printContent(el) {
    var printPage = window.open('', '_blank');
    var printcontent = document.getElementById(el).innerHTML;
    printPage.document.body.innerHTML = printcontent;
    printPage.focus();
    printPage.print();
    //printPage.close();
  }

  const PrintComponent = () => {
    return (
      <div id='print' style={{ display:'none' }}>
        <p>P</p>
      </div>
    )
  }

  return (
    <div>
      <Tooltip title='In Danh sách' displayPrint="none" component={Box}>
        <IconButton onClick={() => printContent('print')}>
          <PrintIcon />
        </IconButton>
      </Tooltip>
      <PrintComponent />
    </div>
  );
}