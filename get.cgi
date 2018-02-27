#!/usr/bin/python
# -*- coding: utf-8 -*-
'''http://code.activestate.com/recipes/286160-cgiproxypy/
'''
import cgi
import urllib2

def pagefetch(thepage):
    req = urllib2.Request(thepage)
    u = urllib2.urlopen(req)
    data = u.read()
    return data

arg = cgi.FieldStorage()
print "content-type: text/json"
print "access-control-allow-origin: *"
print                                   # so is this blank line
a = arg['url'].value
print pagefetch(a)

