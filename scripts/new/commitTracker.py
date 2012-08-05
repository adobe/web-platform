#!/usr/bin/env python

# Commit tracker


import argparse
from ConfigParser import SafeConfigParser
import math
import os
import re
from subprocess import Popen,PIPE,check_call
import sys
import time


import pdb

class Config(object):
    def __init__(self):
        self.set_defaults()
        self.parse_args()
        self.read_config()
        self.set_config()

    def set_defaults(self):
        home = os.getenv('HOME')
        now = time.localtime()
        if home:
            # configuration file
            self.config_file = home + os.sep + '.committrackerrc'
            # repository
            self.repository_root = home + os.sep + 'WebKit'
        else:
            self.config_file = None
            self.repository_root = None
        self.verbose = False
        # should we fetch the latest?
        self.do_fetch = True
        # Date to start grabbing commits at.
        self.since = '01/01/{0}'.format(now.tm_year)
        # Date to stop grabbing commits at.
        self.until = None
        # This should be set in the config file in the "People" section!
        # dictionary of people who's contributions we are looking for
        # name -> email address
        self.people = { }

        self.format = 'Normal'

    def parse_args(self):
        parser = argparse.ArgumentParser(description='Count commits by the Adobe Web Platform Team')
        parser.add_argument('--config', default=None, help='Path to config file, default is {0}'.format(self.config_file))
        parser.add_argument('--verbose', action='store_true', help='Turn on verbose mode')
        parser.add_argument('--no-fetch', dest='no_fetch', action='store_true', help="Don't fetch from origin before counting")
        parser.add_argument('--since', default=None, help='Start date for counting. Defaults to Jan 1st of the current year.')
        parser.add_argument('--until', default=None, help='End date for counting.')
        parser.add_argument('--repo', dest='repository_root', default=None, help='Path to WebKit git repository')
        parser.add_argument('--show-total', dest='show_total', action='store_true', default=None, help='Output only the total')
        self.args = parser.parse_args()

    def read_config(self):
        self.file = SafeConfigParser(allow_no_value=True)
        if self.args.config:
            self.config_file = self.args.config
            with open(self.config_file) as fp:
                self.file.readfp(fp, self.config_file)
        else:
            self.file.read(self.config_file)

    def set_config(self):
        if self.args.verbose:
            self.format = 'Verbose'
        elif self.file.has_option('Options', 'verbose'):
            self.format = 'Verbose' if self.file.get_boolean('Options', 'verbose') else self.format

        if self.args.no_fetch:
            self.do_fetch = False
        elif self.file.has_option('Options', 'do_fetch'):
            self.do_fetch = self.file.get_boolean('Options', 'do_fetch')

        if self.args.since:
            self.since = self.args.since
        elif self.file.has_option('Options', 'since'):
            self.since = self.file.get('Options', 'since')

        if self.args.until:
            self.until = self.args.until
        elif self.file.has_option('Options', 'until'):
            self.until = self.file.get('Options', 'until')

        if self.args.repository_root:
            self.repository_root = self.args.repostitory_root
        elif self.file.has_option('Options', 'repository_root'):
            self.repository_root = self.file.get('Options', 'repository_root')

        if self.args.show_total:
            self.format = 'Total'
        elif self.file.has_option('Options','show_total'):
            self.format = self.file.get('Options', 'show_total')

        self.print_total = False
        if (self.format == 'Verbose' or self.format == 'Total' or self.format == 'Normal'): self.print_total = True

        self.print_normal = True;
        if self.format == 'Total': self.print_normal = False

        self.print_verbose = False;
        if self.format == 'Verbose': self.print_verbose = True

        if self.file.has_section('People'):
            self.people = { person[0] : person[1] for person in self.file.items('People') }

        # This is case insensitive because ConfigParser throws away the case of all of it's keys.
        self.people_matcher = re.compile(self.people_regexp(), re.IGNORECASE)

    def people_regexp(self):
        def helper(l):
            return '|'.join([ re.escape(i) for i in l if len(i) > 0 ])
        return helper(self.people.iterkeys()) + '|' + helper(self.people.itervalues())

    def print_verbose(self):
        if self.format == 'Verbose':
            return True
        return False

    # Normal text
    def print_normal(self):
        if self.format == 'Verbose' or self.format == 'Normal':
            return True
        return False   


    def print_total(self):
        if self.format == 'Verbose' or self.format == 'Total' or self.format == 'Normal':
            return True
        return False   


class Counter(object):
    def __init__(self, data, config):
        self.data = data
        self._config = config
        self.count = 0
        self.count_by_person = { k: 0 for k in self._config.people.iterkeys() }

    def start(self):
        self._next_commit()
        for line in self.data:
            if line.startswith('Author'):
                if self._count_line_if_match(line):
                    self._next_commit()
            elif line.strip().startswith('Patch by'):
                if self._count_line_if_match(line):
                    self._next_commit()
            elif line.startswith('commit'):
                if self._config.print_verbose: print line

    def _next_commit(self):
        for line in self.data:
            if line.startswith('commit'):
                if self._config.print_verbose: print line
                return

    def _count_line_if_match(self, line):
        person = self._line_has_person(line)
        if person:
            if self._config.print_verbose: print line
            self.count += 1
            self.count_by_person[person] += 1
            return True
        else:
            return False

    def _line_has_person(self, line):
        match = self._config.people_matcher.search(line)
        if match:
            matched = match.group(0)
            selector = matched.lower()
            if self._config.people.has_key(selector):
                return selector
            else:
                for (k,v) in self._config.people.iteritems():
                    if v == matched:
                        return k
                raise StandardError, "Unexpected match of unknown value: {0}".format(matched)
        else:
            return None

config = Config()

os.chdir(config.repository_root)
if config.do_fetch:
    if config.print_normal: print 'Fetching updates'
    check_call(['git', 'fetch', 'origin'])

git_log_command = ['git', 'log', 'origin/master']
if config.since:
    git_log_command.append('--since="{0}"'.format(config.since))
if config.until:
    git_log_command.append('--until="{0}"'.format(config.until))
log = Popen(git_log_command, stdout=PIPE)
counter = Counter(log.stdout, config)
counter.start()

if config.print_normal:
    max_digits = 1
    if counter.count > 0:
        max_digits = int(math.log10(counter.count))+1
    print('Commits')
    if config.since:
        print( 'since {0}'.format(config.since)),
    if config.until:
        print( 'until {0}'.format(config.until)),
    print ':'
    breakdown = counter.count_by_person.items()
    breakdown.sort(key=lambda x: -x[1])
    for value in breakdown:
        print( '{0} {1}'.format(str(value[1]).rjust(max_digits), value[0]) )

if config.print_total:
    print counter.count
elif config.print_normal or config.print_verbose:
    print( '{0} total'.format(counter.count))
