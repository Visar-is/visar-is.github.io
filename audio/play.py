import http.client, urllib.parse
import hashlib
import json
import urllib.request
from urllib.error import HTTPError
import sys
import getopt


# This is our application object. It could have any name,
# except when using mod_wsgi where it must be "application"
def application( # It accepts two arguments:
      # environ points to a dictionary containing CGI like environment variables
      # which is filled by the server for each received request from the client
      environ,
      # start_response is a callback function supplied by the server
      # which will be used to send the HTTP status and headers to the server
      start_response):

   # build the response body possibly using the environ dictionary
   response_body = 'The request method was %s' % environ['wsgi.input']['text']

   # HTTP response code and message
   status = '200 OK'

   #text = ''
   #lang = ''
   #salt = 'hy89ry7dbu3e8932hio!/(9!!78!gy8!790)'
   #
   #out = text
   #c = Client("brian@suda.co.uk", "i4lMC3tJ5KVlAPwKQHVnwk0XSF3yOgQt")
   #c.Start()
   #
   ##get URL to the generated sound file
   #soundUrl = c.CreateSpeechFile(text, "text/plain", "is_dora", "wav/22050")
   #
   #retry = 0
   #while retry < 3:
   #    try:
   #        response = urllib.request.urlopen(soundUrl)
   #        wav = response.read()
   #        open(out, "wb").write( wav )
   #        break
   #    except HTTPError as e:
   #        retry += 1


   # These are HTTP headers expected by the client.
   # They must be wrapped as a list of tupled pairs:
   # [(Header name, Header value)].
   response_headers = [('Content-Type', 'text/plain'),
                       ('Content-Length', str(len(response_body)))]

   # Send them to the server using the supplied function
   start_response(status, response_headers)

   # Return the response body.
   # Notice it is wrapped in a list although it could be any iterable.
   return [response_body]

class Client(object):
    __web_comm = None

    def __init__(self, email, password):
        self.__web_comm = Communicator(email, password)

    def Start(self):
        self.__web_comm.Start()

    def CreateSpeechFile(self, text, ctype, voice_id, codec_id, additional={}):
        params={"text": text,
                "contentType": ctype,
                "voiceId": voice_id,
                "codecId": codec_id,
                "params": additional}
        content = self.__web_comm.CallMethod("/api/saas/rest/speechfiles/", params)
        content = json.loads( content )
        return content["soundUrl"]

class Communicator(object):
    __rest = None
    __login = ""
    __password = ""
    __gettoken_params = None
    __headers = {"Content-type": "application/x-www-form-urlencoded"}

    def __init__(self, email, password):
        self.__login = email
        md5 = hashlib.md5()
        md5.update(password.encode())
        self.__password = md5.hexdigest()
        self.__gettoken_params = urllib.parse.urlencode({'email': email})

    def __del__(self):
        if self.__rest != None:
            self.__rest.close()

    def Start(self):
        try:
            self.__rest = http.client.HTTPConnection('api.ivona.com', 80) 
        except http.client.HTTPException as ex: 
            print(ex, "\n")

    def CallMethod(self, method_url, params={}, method="POST"):
        #get token     
        self.__rest.request("POST", "/api/saas/rest/tokens/", self.__gettoken_params, self.__headers)
        token = eval(self.__rest.getresponse().read().decode())

        #compute md5
        md5 = hashlib.md5()
        md5.update(self.__password.encode())
        md5.update(token.encode())    
        tokenized_pass = md5.hexdigest()

        params["token"] = token
        params["md5"] = tokenized_pass

        #call mathod
        if method == "GET" or method == "PUT" or method == "DELETE":
            method_url += "?" + urllib.parse.urlencode(params)
            self.__rest.request(method, method_url)
        else:
            self.__rest.request(method, method_url, urllib.parse.urlencode(params), self.__headers)

        return self.__rest.getresponse().read().decode()

'''
<?php
// this file does two simple things.
// 1. Returns cached WAV files
// 2. fetches WAV files from a service, caches them and returns the audio

// check to see if the parameters are there. We need to know which language and what text to read!
if(!isset($_GET['lang']) || !isset($_GET['text'])) { return; }

// let's be reasonable and cut the text after a certain number of characters
$text = substr($_GET['text'],0,2000);
$lang = substr($_GET['lang'],0,2);
$salt = 'ty79hgue12t78r6219832528!T76852&%%2092';


// create a cache key based on the text and lang
$cache = md5($text.' [LANG:'.$lang.']'.$salt);

// check if the file exists
if (file_exists('.cache/'.$cache.'.wav')){
	// return the file contents
	$str = file_get_contents('.cache/'.$cache.'.wav');
} else {
	// go fetch the audio from the webservice
	$url = synthesize($text);
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER,true);
	curl_setopt($c, CURLOPT_URL, str_replace('&amp;','&',$url));
	curl_setopt($c, CURLOPT_CONNECTTIMEOUT, 2);
	curl_setopt($c, CURLOPT_TIMEOUT, 4);
	curl_setopt($c, CURLOPT_USERAGENT, "curl from http://static.visar.is/ ");
	curl_setopt($c, CURLOPT_FOLLOWLOCATION,1);
	$str = curl_exec($c);
	curl_close($c);
	
	// save it to the cache
	if ($f = @fopen('.cache/'.$cache.'.wav', 'w+')) {
		if (trim($str) != ''){
			fwrite ($f, 
			$str, 
			strlen($str));
		}
		fclose($f);
	}
}

header("Content-type: audio/x-wav");
header("Content-Disposition: attachment; filename=".$cache.'.wav');
echo $content;

/**
 * Function synthesizing a text 
 * Returned variable is an url of the file
 *
 * @param string $text UTF-8 encoded string to synthesize 
 * @return string URL address for speech file synthesized from $text parameter, or false in case of error
 */
function synthesize($text, $text_type='text/plain') {
	// IVONA SAAS API CLIENT CONFIGURATION 
	define('USER', 'brian@suda.co.uk'); // IVONA.com account name (required for IVONA SaaS)
	define('PASSWORD', 'i4lMC3tJ5KVlAPwKQHVnwk0XSF3yOgQt'); // IVONA.com account password (required for IVONA SaaS)
	define('SELECTED_VOICE', 'is_dora'); // selected voice to synthesize
	
	// the configuration (could be moved to constants section of the website)
	// wsdl URL
	$wsdl = 'http://api.ivona.com/saasapiwsdl.xml';
 
	// soap client initialization (it requires soap client php extension available)
	$Binding = new SoapClient($wsdl,array('exceptions' => 0));
 
	// getToken for the next operation
	$input = array('user' => USER);
	$token = $Binding->__soapCall('getToken', $input);
	if (is_soap_fault($token)) {
		error_log('API call: getToken error: '.print_r($token,1));
		return false;
	}
 
	// additional parameters
	$params = array();
	//$params[]=array('key'=>'Prosody-Rate', 'value'=>PROSODY_RATE); // example value for the new text speed
 
	// createSpeechFile (store text in IVONA.com system, invoke synthesis and get the link for the file)
	$input = array('token' => $token,
				'md5' => md5(md5(PASSWORD).$token),
				'text' => $text,		
				'contentType' => $text_type,
				'voiceId' => SELECTED_VOICE,
				'codecId' => 'mp3/22050',
				'params' => $params,
			      );
	$fileData = $Binding->__soapCall('createSpeechFile',$input);
	if (is_soap_fault($fileData)) {
		error_log('API call: createSpeechFile error: '.print_r($fileData,1));
		return false;
	}
 
	// return the sound file url
	return $fileData['soundUrl'];
}

?>
'''