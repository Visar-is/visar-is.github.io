<?php    
    include "qrlib.php";    
    
    $errorCorrectionLevel = 'L';
    $matrixPointSize = 2;

    $qr_data = 'https://www.visar.is';	
    if (isset($_REQUEST['u'])) { 
        //it's very important!
        if (trim($_REQUEST['u']) != ''){
	        // user data
    	    $qr_data = $_REQUEST['u'];    	
        }
    }  
        
    QRcode::png($qr_data, false, $errorCorrectionLevel, $matrixPointSize, 2);    

?>