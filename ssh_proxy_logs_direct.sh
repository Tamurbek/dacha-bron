#!/usr/bin/expect -f
set timeout 30
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "docker logs --tail 100 dacha-proxy-1"
expect {
    "password:" {
        send "$password\r"
    }
}
expect eof
