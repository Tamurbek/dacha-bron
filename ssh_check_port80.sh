#!/usr/bin/expect -f
set timeout 30
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "lsof -i :80"
expect {
    "password:" {
        send "$password\r"
    }
}
expect eof
