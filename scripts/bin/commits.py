#!/usr/bin/python

import sys 
from subprocess import Popen, PIPE
import re
import StringIO

class GitCommit:
	def __init__(self):
		pass
	
	@staticmethod
	def parse_stream( stream ):

		cc = None # Current Commit
		while stream.next():
			print r


def git_log( since=None, until=None ):
	# Why doesn't git handle real shell arguments like everyone else?
	cmd = "git log"
	if since:
		cmd += " --since " + since
	if until:
		cmd += " --until " + until

	print cmd
	proc = Popen( [cmd], shell=True, stdout=PIPE )
	f = StringIO.StringIO( proc.communicate()[0] )



full = git_log();

