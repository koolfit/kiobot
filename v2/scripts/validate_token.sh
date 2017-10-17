#!/bin/bash
# TOKEN VALIDATION SCRIPT
# Script receives <script_name> <username> <token>
user=$1
token=$2
if ! [[ $token =~ ^[0-9]+$ ]]
then
	echo "token"
	exit
fi
modulus=`expr $token % 5`
if [ "$modulus" == "0" ]
then
	echo "allow"
else
	echo "token"
fi
