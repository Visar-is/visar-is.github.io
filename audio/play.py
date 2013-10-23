#!/usr/bin/env python

from wsgiref.simple_server import make_server
from cgi import parse_qs, escape
import hashlib
import json
import sys
import getopt
from urllib2 import Request, urlopen
from urllib import urlencode
import httplib

def application(environ, start_response):

   # Returns a dictionary containing lists as values.

   d = parse_qs(environ['QUERY_STRING'])
   text = d.get('text', 'Something went wrong')[0]
   lang = d.get('lang', 'is')[0]
   salt = 'hy89ry7dbu3e8932hio!/(9!!78!gy8!790)'
   
   md5 = hashlib.md5()
   md5.update(text+lang+salt)
   out = md5.hexdigest()

   # see if there is already a cache of this file
   try:
      with open('cache/%s.mp3'%out) as f:
         response_body = f.read()
   # if not, go make one!
   except:
   
      c = Client("brian@suda.co.uk", "i4lMC3tJ5KVlAPwKQHVnwk0XSF3yOgQt")
      c.Start()
      
      #get URL to the generated sound file
      soundUrl = c.CreateSpeechFile(text, "text/plain", "is_dora", "mp3/22050")

      response = urlopen(soundUrl)
      response_body = response.read()

      # save this to a file to speed it up next time!
      myFile = open('cache/%s.mp3'%out, 'wb')
      myFile.write(response_body)
      myFile.close()

   status = '200 OK'

   # Now content type is text/html
   response_headers = [('Content-Type', 'audio/mpeg3'),
                  ('Content-Length', str(len(response_body)))]
   start_response(status, response_headers)

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
        print content

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
        self.__gettoken_params = urlencode({'email': email})

    def __del__(self):
        if self.__rest != None:
            self.__rest.close()

    def Start(self):
        try:
            self.__rest = httplib.HTTPConnection('api.ivona.com', 80) 
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
            method_url += "?" + urlencode(params)
            self.__rest.request(method, method_url)
        else:
            self.__rest.request(method, method_url, urlencode(params), self.__headers)

        return self.__rest.getresponse().read().decode()

#httpd = make_server('localhost', 8051, application)
# Now it is serve_forever() in instead of handle_request().
# In Windows you can kill it in the Task Manager (python.exe).
# In Linux a Ctrl-C will do it.
#httpd.serve_forever()