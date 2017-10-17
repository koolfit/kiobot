#!/bin/bash
pingtimeout="600"
id=`date +%Y%M%d-%H%M%S%N`
title="$id (reboot win7)"
domid=`virsh -c qemu:///system list | grep win7 | tr -s " " | cut -d " " -f 2`
echo "${title}: Starting monitor process. Sending reboot command ($(date +%H:%M:%S))..."
virsh -c qemu:///system reboot $domid > /dev/null 2>&1
if [ "$?" != "0" ] ; then echo "ERROR: Error sending reboot command ($(date +%H:%M:%S))."; exit -1; fi
echo "${title}: Reboot command sent. Waiting reboot event in host win7 ($(date +%H:%M:%S))..."
virsh -c qemu:///system event --event reboot --domain $domid --timestamp --timeout 300 >/dev/null 2>&1
if [ "$?" != "0" ]
then
	echo "${title}: ERROR: Timeout waiting for reboot confirmation for host: win7. Killing monitor ($(date +%H:%M:%S))."
	exit -1
fi
echo "${title}: Reboot event received for host win7. Host is now booting... ($(date +%H:%M:%S))..."
echo "${title}: Waiting for host to respond ping ($(date +%H:%M:%S))..."
counter=0
while ! ping -c 1 192.168.122.82>/dev/null 2>&1 ; do echo "" > /dev/null; counter=$(($counter + 1)); if [ "$counter" == "$pingtimeout" ] ; then echo "${title}: ERROR: Timeout waiting for ping to respond (${pingtimeout} seconds). Killing monitor ($(date +%H:%M:%S))."; exit 1; break; fi; done;
response=`ping -c 1 192.168.122.82`
echo "${title}: Ping response received. Reboot succeded ($(date +%H:%M:%S))..."
echo "${title}: Stopping monitor ($(date +%H:%M:%S))."
