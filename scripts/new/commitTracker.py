#!/usr/bin/env python

# Commit tracker

################################################################################
# FIXME all of the following should be in a config file and set via command
# line args

# Date to start grabbing commits at.
# FIXME this must be of this form, or it will not work. Need to get a proper
# date parsing library. Or should this just be automatically generated as back
# to the beginning of the current year?
since='01/01/2012' 

# repository
# FIXME we really need a much better default than this, or it must be required
# to be set
repositoryRoot = '/Users/bjonesbe/Code/WebKit'

# default ref
branchHead = 'refs/remotes/origin/master'

# dictionary of people who's contributions we are looking for
# name -> email address
people = [
    'Bear Travis': '', # FIXME I need an email
    'Mihnea': 'mihnea@adobe.com',
    'Chiculita': 'achicu@adobe.com',
    'Raul Hudea': '', # FIXME I need an email
    'Max Vujovic': '', # FIXME I need an email
    'Hans Muller': '', # FIXME I need an email
    'Ethan Malasky': '', # FIXME I need an email
    'Arno Gourdol': '', # FIXME I need an email
    'Alan Stearns': '', # FIXME I need an email
    'Larry McLister': '', # FIXME I need an email
    'Jacob Goldstein': '', # FIXME I need an email
    'Dirk Schulze': 'krit@webkit.org',
    'Rebecca Hauck': '', # FIXME I need an email
    'Flex Mobile': '', # FIXME I need an email
    'David Alcala': '', # FIXME I need an email
    'Victor Carbune': '', # FIXME I need an email
    'Mihai Balan': '', # FIXME I need an email
    'Bem Jones-Bey': 'bjonesbe@adobe.com'
]

################################################################################

from dulwich.repo import Repo

repo = Repo(repositoryRoot)

