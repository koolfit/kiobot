#!/bin/bash
# should get parameters: infra command subcommand user token
dir=`dirname $0`
source ${dir}/proxy_wrapper_config.sh
infra=$1
command=$2
subcommand=$3
user=$4
token=$5
filterline="\(${infra}\|*\)|\(${command}\|*\)|\(.*${subcommand}.*\|*\)|\(.*${user}.*\|*\).*"
matchingrules=`echo "$SECURITY_CONFIG" | grep "${filterline}"`
if [ "$matchingrules" == "" ]
then
	echo $SECURITY_DEFAULT_POLICY
	exit
fi
denyrules=`echo "$matchingrules" | cut -d "|" -f 6 | grep deny`
if [ "$denyrules" != "" ]
then
	echo "deny"
	exit
fi
token_needed=`echo "$matchingrules" | cut -d "|" -f 5 | grep token`
if [ "$token_needed" != "" ]
then
	response=`$LOCAL_SOURCE_DIR/validate_token.sh $user $token`
	if [ "$?" != "0" ] ; then >&2 echo "Token not valid"; echo "No se ha proporcionado un token o el token es inválido. Intente nuevamente."; exit -1; fi
	echo "$response" | tr -d "\n"
	exit
fi
allowrules=`echo "$matchingrules" | cut -d "|" -f 6 | grep allow`
if [ "$allowrules" != "" ]
then
	echo "allow"
	exit
fi
