#!/bin/bash
#OPENSTACK_CREDS=/root/admin-openrc.sh
LOCAL_SOURCE_DIR=`dirname $0`
LOCAL_SCREENSHOTS_PATH=$LOCAL_SOURCE_DIR/../resources/screenshots/

# CONNECTIONS_CONFIG: ONE INFRASTRUCTURE CONNECTION DATA PER LINE
# FORMAT:
# <infrastructure_name>|<remote_user>|<remote_ip_or_hostname>|<remote_ssh_port>|<remote_wrapper_script_full_path>
CONNECTIONS_CONFIG="bessel|kftadmin|10.52.13.50|65535|/root/botscripts/controller_wrapper.sh"
# SECURITY_DEFAULT_POLICY
# Every request that does not match any SECURITY_CONFIG specific rule will be managed by this policy
# SECURITY_DEFAULT_POLICY="<allow|deny>" 
SECURITY_DEFAULT_POLICY="deny"
# SECURITY_CONFIG
# Rules to evaluate authorization to bot api
# FORMAT:
# <infrastructure>|<command>|<subcommand>|<slack_user_list>|<auth_type>|<allow|deny>
# <infrastructure> is the identifier to the infrastructure. It can be many lines for a specific infrastructure with different <infrastructure> name (example: one line for 'fenix' and other for 'tsjdf')
# <command> is the list of commands (comma-separated) to filter this rule (eg. get, sendme, exec)
# <subcommand> is the list of subcommands to apply to this rule
# <auth_type> is the authorization type required for the request
# <slack_user_list> is the list of users (slack usernames, comma-separated) to who apply this rule
# the rule can be configured to allow or deny the command for a specific match
# All fields can use * for "all" wilcard
# valid auth_types:
# local: auth is defined by local SECURITY_CONFIG
# remote: remote host authorization is needed (remote controller)
# token: local validation of auth token needed
# NOTE: deny rules takes precedence over any allow rule
# (If a request matches many rules, and ANY rule deny athorization, the authorization of the request is denied)

SECURITY_CONFIG="bessel|get|test,hostid|*|local|allow
bessel|get|hostdetails|saulcastro7807|token|allow
bessel|get|test|*|token|allow
bessel|sendme|screenshot|*|token|allow
bessel|exec|*|*|remote|allow
"
# Filter all spaces from SECURITY_CONFIG variable
SECURITY_CONFIG=`echo "$SECURITY_CONFIG" | tr -d " "`
