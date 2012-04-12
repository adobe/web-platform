#!/usr/bin/python

import sys 
from subprocess import Popen, PIPE
import re
import StringIO

class GitCommit:
	all_commits = []

	def __init__(self):
		pass
	
	@staticmethod
	def parse_stream( stream ):

		cc = None # Current Commit
		while True:
			try:
				r = stream.next()
			except StopIteration:
				break
			if r:
				print r
				commit_match = re.match("^commit (\w*)$", r)
				if commit_match:
					print "match = ", m.group(1)
					if cc:
						all_commits += cc
						cc = GitCommit()
					else if
    # e.g. Patch by Eric Seidel <eric@webkit.org> on 2011-09-15
    patch_by_regexp = r'^Patch by (?P<name>.+?)\s+<(?P<email>[^<>]+)> on (?P<date>\d{4}-\d{2}-\d{2})$'


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

	return GitCommit.parse_stream(f)

full = git_log();

