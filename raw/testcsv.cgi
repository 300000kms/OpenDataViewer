#!/usr/bin/python
# -*- coding: utf-8 -*-
import csv
import cgi
import urllib2

print "content-type: text/csv"
print "access-control-allow-origin: *"

#arg = cgi.FieldStorage()
#url = arg['url'].value

url = 'http://opendata-ajuntament.barcelona.cat/resources/sedac/Plans_Especials_359.csv'
req = urllib2.Request(url)
u = urllib2.urlopen(req)
data = u.read()

t = data

in_txt = csv.reader(t.split('\n'))#, delimiter = ',')

#buscar columnas sin nombre
in_txt = [ii for ii in in_txt]

while in_txt[0][-1] =='':
    for ii,v in enumerate(in_txt):
        if len(v) == 0:
            in_txt.pop(ii)
        else:
            in_txt[ii].pop(-1)

x=None
for i in in_txt:
    if x is None: #detecta la longitud de una fila inicial
        x=len(i)
    if len(i) == x: #si no cumple la saca
        print ', '.join(['"%s"' %(ii) for ii in i])
