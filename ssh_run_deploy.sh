#!/usr/bin/expect -f
set timeout 1200
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "bash /tmp/deploy_on_server.sh"
expect {
    "(yes/no)?" {
        send "yes\r"
        exp_continue
    }
    "password:" {
        send "$password\r"
    }
}
# Expect output to finish
expect eof
