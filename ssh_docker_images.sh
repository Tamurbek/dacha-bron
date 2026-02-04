#!/usr/bin/expect -f
set timeout 30
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "cd /var/www/dacha && docker images"
expect {
    "(yes/no)?" {
        send "yes\r"
        exp_continue
    }
    "password:" {
        send "$password\r"
    }
}
expect eof
