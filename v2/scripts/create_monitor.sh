#!/bin/bash
basedir=`dirname $0`
echo "Done"
nohup ${basedir}/monitor_instance.sh | ${basedir}/slackcat &
exit
