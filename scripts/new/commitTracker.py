#!/usr/bin/env python

# Commit tracker

################################################################################
# FIXME all of the following should be in a config file and set via command
# line args

verbose = False

# Date to start grabbing commits at.
since='01/01/2012' 

# repository
# FIXME we really need a much better default than this, or it must be required
# to be set
repositoryRoot = '/Users/bjonesbe/Code/WebKit'

# dictionary of people who's contributions we are looking for
# name -> email address
people = {
    'Bear Travis': '',
    'Mihnea': 'mihnea@adobe.com',
    'Chiculita': 'achicu@adobe.com',
    'Raul Hudea': '',
    'Max Vujovic': '',
    'Hans Muller': '',
    'Ethan Malasky': '',
    'Arno Gourdol': '',
    'Alan Stearns': '',
    'Larry McLister': '',
    'Jacob Goldstein': '',
    'Dirk Schulze': 'krit@webkit.org',
    'Rebecca Hauck': '',
    'Flex Mobile': '',
    'David Alcala': '',
    'Victor Carbune': '',
    'Mihai Balan': '',
    'Bem Jones-Bey': 'bjonesbe@adobe.com'
}

################################################################################

import os
import re
from subprocess import Popen,PIPE,check_call
import sys

def filterAndEscape(l):
    return [ re.escape(i) for i in l if len(i) > 0 ]

peopleMatcher = re.compile('|'.join(filterAndEscape(people.keys())) + '|' + '|'.join(filterAndEscape(people.values())))

class Counter(object):
    def __init__(self, data):
        self.data = data
        self.count = 0
        self._currentCommit = 'NONE'

    def start(self):
        self._nextCommit()
        for line in self.data:
            if line.startswith('Author'):
                if self._lineHasPerson(line):
                    if verbose:
                        print line
                    self.count += 1
                    self._nextCommit()
            elif line.strip().startswith('Patch by'):
                if self._lineHasPerson(line):
                    if verbose:
                        print line
                    self.count += 1
                    self._nextCommit()

    def _nextCommit(self):
        for line in self.data:
            if line.startswith('commit'):
                if verbose:
                    print line
                return

    def _lineHasPerson(self, line):
        return peopleMatcher.search(line)

os.chdir(repositoryRoot)
print("Fetching updates")
check_call(['git', 'fetch', 'origin'])

log = Popen(['git', 'log', 'origin/master', '--since="{0}"'.format(since)], stdout=PIPE)
counter = Counter(log.stdout)
counter.start()

print('Counted {0} commits since {1}'.format(counter.count, since))
