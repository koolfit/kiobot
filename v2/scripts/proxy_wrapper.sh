#!/bin/bash
sourcepath=`dirname $0`
source ${sourcepath}/proxy_wrapper_config.sh
user=$1
infra=$2
command=$3
subcommand=$4
auth_subcommand=`echo $subcommand | sed 's/^ *//g' | sed 's/ *$//g' | cut -d " " -f 1`
token=`echo ${subcommand##* }`
connection=`echo "$CONNECTIONS_CONFIG" | grep $infra`
nums=`echo $connection | wc -l`
case $command in
	sendme)
	;;
	get)
	;;
	exec)
	;;
	*)
		echo "ERROR: comando no reconocido: $command"
		exit -1
esac
if [ "$nums" -gt "1" ]
then
	>&2 echo "ERROR: More than 1 connection config found for infrastructure: $infra"
	exit -1
fi
if [ "$nums" == "0" ] | [ "$connection" == "" ]
then
	>&2 echo "ERROR: No connection config found for infrastructure: $infra"
	exit -1
fi
auth=`${sourcepath}/proxy_auth.sh $infra $command $auth_subcommand $user $token`
if [ "$auth" == "deny" ]
then
	>&2 echo "Request NOT AUTHORIZED"
	echo "ERROR: La petición (${command} ${auth_subcommand}) no está autorizada para este usuario: $user"
	exit -1
fi
if [ "$auth" == "token" ]
then
	>&2 echo "Token needed"
	echo "ERROR: La peticion (${command} ${auth_subcommand}) requiere autorizacion por token para el usuario: $user"
	exit -1 
fi
if [ "$auth" != "allow" ]
then
	>&2 echo "Authorization error"
	echo "Error de autorizacion: operación no permitida"
	exit -1
fi
case $command in
	sendme)
		connname=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 1`
		connuser=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 2`
		connhost=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 3`
		connport=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 4`
		scrpath=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 5`
		filename=`sshpass -p "6wqNZ*8X" ssh ${connuser}@${connhost} -p ${connport} "sudo ${scrpath} ${subcommand}"`
		if [ "$?" != "0" ] ; then >&2 echo "(proxy): Wrapper returned an error."; echo "ERROR: ${filename}"; exit -1; fi
		sshpass -p "6wqNZ*8X" ssh ${connuser}@${connhost} -p ${connport} "sudo chmod 777 ${filename}"
		sshpass -p "6wqNZ*8X" scp -P ${connport} ${connuser}@${connhost}:${filename} $LOCAL_SCREENSHOTS_PATH
		sshpass -p "6wqNZ*8X" ssh ${connuser}@${connhost} -p ${connport} "sudo rm ${filename}"
		fname=`basename $filename`
		localfname="${LOCAL_SCREENSHOTS_PATH}${fname}"
		filejpgname=`echo $localfname | sed 's/ppm$/jpg/'`
		convert $localfname $filejpgname
		rm $localfname
		echo $filejpgname | tr -d '\n'
	;;
	get)
		connname=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 1`
		connuser=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 2`
		connhost=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 3`
		connport=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 4`
		scrpath=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 5`
		response=`sshpass -p "6wqNZ*8X" ssh ${connuser}@${connhost} -p ${connport} "sudo ${scrpath} ${subcommand}"`
		if [ "$?" != "0" ] ; then >&2 echo "(proxy): Wrapper returned an error."; echo "ERROR: ${response}"; exit -1; fi
		echo "$response"
	;;
	exec)
		connname=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 1`
		connuser=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 2`
		connhost=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 3`
		connport=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 4`
		scrpath=`echo "$CONNECTIONS_CONFIG" | grep $infra | cut -d "|" -f 5`
		response=`sshpass -p "6wqNZ*8X" ssh ${connuser}@${connhost} -p ${connport} "sudo ${scrpath} ${subcommand}"`
		if [ "$?" != "0" ] ; then >&2 echo "(proxy): Wrapper returned an error."; echo "ERROR: ${response}"; exit -1; fi
		echo "$response"
	;;
	*)
		>&2 echo "Unknown  command: $2"
		exit -1
esac
