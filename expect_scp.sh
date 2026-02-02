#!/usr/bin/expect -f
set timeout 300
set file [lindex $argv 0]
set host "root@94.183.184.106"
set password "Code2025#"

spawn scp $file $host:/tmp/
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
