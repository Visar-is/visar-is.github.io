<?php

function clean_name($tag) {  
	$code_ent_match = array(' ','-','--','---','&quot;','!','@','#','$','%','^','&','*','(',')','+','{','}','|',':','"','<','>','?','[',']','\\',';',"'",',','.','/','*','+','~','`','='); 
	$code_ent_replace = array(' ','','','','','','','','','','','','','','','','','','','','','','','','','','',''); 
	$tag = str_replace($code_ent_match, $code_ent_replace, $tag); 
	return $tag; 
} 

function check_email_address($email) {

	if (preg_match('/^[^0-9][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[@][a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,4}$/', $email))
	{ 
    	return true;
	}

	return false;
}

// Output JSON
$LanguageMsgs = array(
	'english'	=> array(
		'name'		=> 'You must provide a name.',
		'photo'		=> 'Please enter a phone number.',
		'email'		=> 'Please enter an email.',
		'email_invalid' => 'That email address is not valid.',
		'success'	=> 'Your message was successfully sent!',
		'error'		=> 'Oops we could not send your message.'
	),
	'icelandic' => array(
		'name'		=> 'Þú verður að gefa upp nafn.',
		'photo'		=> 'Vinsamlegast sláðu inn símanúmer.',
		'email'		=> 'Þú verður að gefa upp netfang.',
		'email_invalid' => 'Þetta netfang er ekki gilt.',
		'success'	=> 'Skeytið var sent!',
		'error'		=> 'Við gátum ekki sent skilaboðin.'
	)
);

$Language = stripslashes($_POST['language']);
$ResultMessage = '';

// Name
if (isset($_POST['name'])):
	$Name 			= stripslashes(clean_name($_POST['name']));
	$NameState 		= true;
else:
	$NameState 		= false;
	$ResultMessage .= $LanguageMsgs[$Language]['name'];
endif;


// Phone
if (isset($_POST['phone'])):
	$Phone			= stripslashes($_POST['phone']);
	$PhoneState 	= true;
else:
	$PhoneState 	= false;
	$ResultMessage .= $LanguageMsgs[$Language]['phone'];
endif;


// Email
if (check_email_address($_POST['email'])):
	$Email 			= stripslashes($_POST['email']);
	$EmailState 	= true;
else:
	$EmailState 	=  false;
	$ResultMessage .= $LanguageMsgs[$Language]['email_invalid'];
endif;




//CHECKS TO SEE IF ALL THREE REQUIRED FIELDS ARE FILLED IN	
if (($NameState == true) && ($EmailState == true) && ($PhoneState == true)):

	//SEND MEMBER EMAIL
	$MessagePost = '{
		"key": "VtTYH7yjVEoIVwCpIahAyg",
		"message": {
		    "html": "<p>Name: '.$Name.'<br>Email: '.$Email.'<br>Phone: '.$Phone.'</p><p>'.$_POST['comment'].'</p>",
		    "text": "Name: '.$Name.' - Email: '.$Email.' - Phone: '.$Phone.' - '.$_POST['comment'].'",
		    "subject": "Contact from Visar.is",
		    "from_email": "'.$Email.'",
		    "from_name": "'.$Name.'",
		    "to": [{
		    	"email": "visar@visar.is",
		    	"name": "Vísar"	
		    }],
		    "headers": {},
		    "track_opens": true,
		    "track_clicks": true,
		    "auto_text": true,
		    "url_strip_qs": true,
		    "preserve_recipients": true,
		    "merge": true,
		    "global_merge_vars": [],
		    "merge_vars": [],
		    "tags": [],
		    "google_analytics_domains": [],
		    "google_analytics_campaign": "...",
		    "metadata": [],
		    "recipient_metadata": [],
		    "attachments": []
		},
		"async": false
	}';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://mandrillapp.com/api/1.0/messages/send.json');
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $MessagePost);

	$json_result = curl_exec($ch);
	$result = json_decode($json_result);

	if ($result[0]->status == 'sent'):
		echo json_encode(array('status' => 'success', 'message' => $LanguageMsgs[$Language]['success']));
	else: 
		echo json_encode(array('error' => 'success', 'message' => $LanguageMsgs[$Language]['error']));		
	endif;

else:
	$ErrorMessage = $LanguageMsgs[$Language]['error'].' '.$ResultMessage;

	echo json_encode(array('status' => 'error', 'message' => $ErrorMessage));
endif;
