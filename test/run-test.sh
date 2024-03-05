#! /bin/sh

VERBOSE=0
while getopts v OPT
do
  case $OPT in
     v) VERBOSE=1;;
  esac
done

rm -rf report.txt
if [ $VERBOSE -eq 1 ]; then
	satysfi --text-mode "text" main.test.saty -o report.txt
else
	satysfi --text-mode "text" main.test.saty -o report.txt > /dev/null
fi

if [ -e report.txt ]; then
	cat report.txt
	cat report.txt | grep "0 fail" > /dev/null
else
	exit 1
fi
