#!/usr/bin/env python

# Commit tracker


import argparse
from ConfigParser import SafeConfigParser
import os
import re
from subprocess import Popen,PIPE,check_call
import sys
import time

class Config(object):
    def __init__(self):
        self.set_defaults()
        self.parse_args()

    def set_defaults(self):
        home = os.getenv('HOME')
        now = time.localtime()
        if home:
            # configuration file
            self.config_file = home + os.sep + '.committrackerrc'
            # repository
            self.repository_root = home + os.sep + 'Code' + os.sep + 'WebKit'
        else:
            self.config_file = None
            self.repository_root = None
        self.verbose = False
        # should we fetch the latest?
        self.do_fetch = True
        # Date to start grabbing commits at.
        self.since = '01/01/{0}'.format(now.tm_year)
        # FIXME this must move to the config file!
        # dictionary of people who's contributions we are looking for
        # name -> email address
        self.people = {
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
        self.people_matcher = re.compile(self.people_regexp())

    def parse_args(self):
        parser = argparse.ArgumentParser(description='Count commits by the Adobe Web Platform Team')
        parser.add_argument('--config', default=self.config_file, help='Path to config file')
        parser.add_argument('--verbose', action='store_true', help='Turn on verbose mode')
        parser.add_argument('--no-fetch', dest='no_fetch', action='store_true', help="Don't fetch from origin before counting")
        parser.add_argument('--since', default=self.since, help='Start date for counting. Defaults to Jan 1st of the current year.')
        parser.add_argument('--repo', dest='repository_root', default=self.repository_root, help='Path to WebKit git repository')
        self.args = parser.parse_args()

    def people_regexp(self):
        def helper(l):
            return '|'.join([ re.escape(i) for i in l if len(i) > 0 ])
        return helper(self.people.keys()) + '|' + helper(self.people.values())


class Counter(object):
    def __init__(self, data, config):
        self.data = data
        self.count = 0
        self._config = config

    def start(self):
        self._next_commit()
        for line in self.data:
            if line.startswith('Author'):
                if self._line_has_person(line):
                    if self._config.verbose:
                        print line
                    self.count += 1
                    self._next_commit()
            elif line.strip().startswith('Patch by'):
                if self._line_has_person(line):
                    if self._config.verbose:
                        print line
                    self.count += 1
                    self._next_commit()

    def _next_commit(self):
        for line in self.data:
            if line.startswith('commit'):
                if self._config.verbose:
                    print line
                return

    def _line_has_person(self, line):
        return self._config.people_matcher.search(line)

config = Config()

os.chdir(config.repository_root)

if config.do_fetch:
    print "Fetching updates"
    check_call(['git', 'fetch', 'origin'])

print "Processing log"
log = Popen(['git', 'log', 'origin/master', '--since="{0}"'.format(config.since)], stdout=PIPE)
counter = Counter(log.stdout, config)
counter.start()

print('Counted {0} commits since {1}'.format(counter.count, config.since))
