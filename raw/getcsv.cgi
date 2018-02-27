#!/usr/bin/python
'''
# -*- coding: utf-8 -*-
'''
import cgi
import urllib2
import csv

print "content-type: text/csv"
print "access-control-allow-origin: *"
print

#arg = cgi.FieldStorage()
#url = arg['url'].value

#url = 'http://opendata-ajuntament.barcelona.cat/resources/sedac/Plans_Especials_359.csv'
url = 'http://opendata-ajuntament.barcelona.cat/resources/bsm/HORARIS.CSV'

req = urllib2.Request(url)
u = urllib2.urlopen(req)
data = u.read()

t = data

in_txt = csv.reader(t.split('\n')) #, delimiter = ',')

in_txt = [ii for ii in in_txt]

#buscar columnas sin nombre
while in_txt[0][-1] =='':
    for ii,v in enumerate(in_txt):
        if len(v) == 0:
            in_txt.pop(ii)
        else:
            in_txt[ii].pop(-1)

x=None
for i in in_txt:
    if x is None:
        x=len(i)
    if len(i) == x:
        print  ', '.join(['"%s"' %(ii.encode('utf-8')) for ii in i])
print

