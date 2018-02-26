#!/usr/bin/python
# -*- coding: utf-8 -*-
'''http://code.activestate.com/recipes/286160-cgiproxypy/
'''
import cgi
#import cgitb; cgitb.enable() # Optional; for debugging only
import urllib2
import csv

def pagefetch(thepage):
    req = urllib2.Request(thepage)
    u = urllib2.urlopen(req)
    data = u.read()

    return data

arg = cgi.FieldStorage()
print "content-type: text/csv"
#print "Content-type: text/html"         # this is the header to the server
print "access-control-allow-origin: *"
print                                   # so is this blank line
a = arg['url'].value
print '\n'.join(['"%s"' %(aa.strip(',"')) for aa in pagefetch(a).split('\n')])




