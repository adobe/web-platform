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
import json
from datetime import datetime, timedelta

import pdb


def handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
#    elif isinstance(obj, ...):
#        return ...
    else:
        raise TypeError, 'Object of type %s with value of %s is not JSON serializable' % (type(obj), repr(obj))

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

        self.scriptdir = os.path.abspath( os.path.dirname(sys.argv[0]) )
        print "scriptdir = ", self.scriptdir


        self.verbose = False
        # should we fetch the latest?
        self.do_fetch = True
        # Date to start grabbing commits at.
        self.since = '01/01/{0}'.format(now.tm_year)
        # Date to stop grabbing commits at.
        self.until = None
        self.until = '{0}/{1}/{2}'.format(now.tm_mon, now.tm_mday, now.tm_year)

        self.weekly = False
        # This should be set in the config file in the "People" section!
        # dictionary of people who's contributions we are looking for
        # name -> email address
        self.people = { }

        self.json_file = None

        self.people_file = None

    def parse_args(self):
        parser = argparse.ArgumentParser(description='Count commits by the Adobe Web Platform Team')
        parser.add_argument('--config', default=None, help='Path to config file, default is {0}'.format(self.config_file))
        parser.add_argument('--verbose', action='store_true', help='Turn on verbose mode')
        parser.add_argument('--no-fetch', dest='no_fetch', action='store_true', help="Don't fetch from origin before counting")
        parser.add_argument('--since', default=None, help='Start date for counting. Defaults to Jan 1st of the current year.')
        parser.add_argument('--until', default=None, help='End date for counting.')
        parser.add_argument('--repo', dest='repository_root', default=None, help='Path to WebKit git repository')
        parser.add_argument('--weekly', dest='weekly', action='store_true', default=None, help='Query for every week between since and until, inclusive')
        parser.add_argument('--json-file', dest='json_file', default=None, help='File for writing JSON output')
        parser.add_argument('--people-file', dest='people_file', default=None, help='JSON input file for descripting people to track')
        self.args = parser.parse_args()

    def read_config(self):
        self.file = SafeConfigParser(allow_no_value=True)
        if self.args.config:
            self.config_file = self.args.config
            with open(self.config_file) as fp:
                self.file.readfp(fp, self.config_file)
        else:
            self.file.read(self.config_file)

    def read_people(self):
        pdb.set_trace()
        with open(self.people_file,'r') as f:
            self.people = json.load(f)['people']
            print "People: ",
            for k in self.people.itervalues(): 
                arr = k['emails']
                print arr
        return True

    def set_config(self):
        if self.args.verbose:
            self.verbose = True
        elif self.file.has_option('Options', 'verbose'):
            self.verbose = self.file.get_boolean('Options', 'verbose')

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

        if self.args.json_file:
            self.json_file = self.args.json_file
        elif self.file.has_option('Options', 'json_file'):
            self.json_file = self.file.get('Options', 'json_file')

        if self.args.people_file:
            self.people_file = self.args.people_file
        elif self.file.has_option('Options', 'people_file'):
            self.people_file = self.file.get('Options', 'people_file')
        else:
            self.people_file = os.path.join(self.scriptdir, 'people.json')

        if self.args.weekly:
            self.weekly = self.args.weekly
        elif self.file.has_option('Options', 'weekly'):
            self.weekly = self.file.get('Options', 'weekly')

        self.read_people()

        self.people_matcher = re.compile(self.people_regexp())

    def people_regexp(self):
        def helper(l):
            return '|'.join([ re.escape(i) for i in l if len(i) > 0 ])
        def email_helper(l):
            pdb.set_trace()
            foo = '|'.join([helper(i['emails']) for i in l])
            return foo

        return helper(self.people.iterkeys()) + '|' + email_helper(self.people.itervalues())

class Counter(object):
    def __init__(self, data, config, since, until):
        self.data = data
        self._config = config
        self.since = since
        self.until = until
        self.count = 0
        self.count_by_person = { k: 0 for k in self._config.people.iterkeys() }

    def __repr__(self):
        r = { 'total':self.count, 'people':self.count_by_person }
        print '<MyObj(%s)>' % self.count
        return '<MyObj(%s)>' % self.count

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
                if self._config.verbose: print line

    def _next_commit(self):
        for line in self.data:
            if line.startswith('commit'):
                if self._config.verbose: print line
                return

    def _count_line_if_match(self, line):
        person = self._line_has_person(line)
        if person:
            if self._config.verbose: print line
            self.count += 1
            self.count_by_person[person] += 1
            return True
        else:
            return False

    def _line_has_person(self, line):
        match = self._config.people_matcher.search(line)
        if match:
            matched = match.group(0)
            selector = matched
            if self._config.people.has_key(selector):
                print "Matched on Name", selector
                return selector
            else:
                for (k,v) in self._config.people.iteritems():
                    if matched in v['emails']:
                        print "Matched on", matched, "returning", k
                        return k
                pdb.set_trace()
                raise StandardError, "Unexpected match of unknown value: {0}".format(matched)
        else:
            return None

    def _json_struct(self):
        json_struct = {}
        now = time.localtime()
        json_struct['since'] = self.since
        json_struct['until'] = self.until
        #json_struct['people'] = self.count_by_person
        json_struct['total'] = self.count
        return json_struct

def _build_json_struct(config, counters):
    json_struct = {}
    json_struct['since'] = config.since
    json_struct['until'] = config.until
    json_struct['weekly'] = config.weekly
    json_struct['results'] = [ x._json_struct() for x in counters]
    return json_struct

def _parse_date(date_string, desc=None):
    d = None
    try:
        d = datetime.strptime( date_string, '%m/%d/%y')
    except ValueError:
        try:
            d = datetime.strptime( date_string, '%m/%d/%Y')
        except ValueError:
            print 'Error parsing "{0}" date: {1}'.format(desc, date_string)
    return d

config = Config()
sincedate = _parse_date( config.since, "since" )
untildate = _parse_date( config.until, "until" )
counters = []
currentuntildate = sincedate
weekcount = 0

origcwdu = os.getcwdu()
os.chdir(config.repository_root)
if config.do_fetch:
    print 'Fetching updates'
    check_call(['git', 'fetch', 'origin'])

while True:

    git_log_command = ['git', 'log', 'origin/master']
    if config.since:
        git_log_command.append('--since="{0}"'.format(config.since))
    if config.until:
        if config.weekly:
            weekcount = weekcount + 1
            currentuntildate = sincedate + timedelta( weeks=weekcount )
            if currentuntildate > untildate:
                currentuntildate = untildate
        else:
            currentuntildate = untildate
        git_log_command.append('--until="{0}/{1}/{2}"'.format(currentuntildate.month, currentuntildate.day,currentuntildate.year))

    log = Popen(git_log_command, stdout=PIPE)
    counter = Counter(log.stdout, config, sincedate, currentuntildate)
    counter.start()

    max_digits = 1
    if counter.count > 0:
        max_digits = int(math.log10(counter.count))+1
    print('Commits'),
    if config.since:
        print( 'since {0}'.format(sincedate)),
    if currentuntildate:
        print( 'until {0}'.format(currentuntildate)),
    print ':'
    breakdown = counter.count_by_person.items()
    breakdown.sort(key=lambda x: -x[1])
    for value in breakdown:
        print( '{0} {1}'.format(str(value[1]).rjust(max_digits), value[0]) )
    print( '{0} total'.format(counter.count))

    counters.append( counter )

    if config.weekly == False or untildate == currentuntildate:
        break

if config.json_file:
    json_struct = _build_json_struct(config, counters)
    s = json.dumps(json_struct, default=handler, sort_keys=True, indent=4)
    json_string = 'commits = '+ '\n'.join([l.rstrip() for l in  s.splitlines()])
    os.chdir(origcwdu)
    f = open(config.json_file, 'w')
    f.write(json_string)
    f.close()
