#!/usr/bin/expect -f
set timeout 60
spawn ssh root@94.183.184.106 "uname -a; uptime"
expect {
    "(yes/no)?" {
        send "yes\r"
        exp_continue
    }
    "password:" {
        send "Code2025#\r"
    }
}
expect eof
