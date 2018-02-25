#!/usr/bin/python
# -*- coding: utf-8 -*-

##detect encoding...


import requests
import csv
proxy = 'http://www.atnight.ws/od/raw/get.cgi?url='
proxy =''
url = 'http://opendata-ajuntament.barcelona.cat/resources/sedac/Plans_Especials_359.csv'

r = requests.get(url)

t=r.text.encode('latin-1')

in_txt = csv.reader(t.split('\n'), delimiter = ',')

x=None
for i in in_txt:
    if x is None:
        x=len(i)
    if len(i) == x:
        print i


#out_csv = csv.writer(open(csv_file, 'wb'))
#out_csv.writerows(in_txt)

#check last column
#check lastline
#check encoding
