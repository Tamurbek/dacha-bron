#!/usr/bin/expect -f
set timeout 300
spawn ssh root@94.183.184.106 "docker --version && docker-compose --version && git --version"
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
