#!/usr/bin/expect -f
set timeout 60
spawn ssh root@94.183.184.106 "docker compose version && git --version"
expect {
    "password:" {
        send "Code2025#\r"
    }
}
expect eof
