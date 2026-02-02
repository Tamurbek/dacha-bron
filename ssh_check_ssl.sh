#!/usr/bin/expect -f
set timeout 60
spawn ssh root@94.183.184.106 "ls -l /etc/letsencrypt/live/jizzaxrest.uz/"
expect {
    "password:" {
        send "Code2025#\r"
    }
}
expect eof
