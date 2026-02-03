#!/usr/bin/expect -f
set timeout 30
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "docker exec dacha-db-1 psql -U postgres -d dacha -c 'SELECT count(*) FROM listing;'"
expect {
    "password:" {
        send "$password\r"
    }
}
expect eof
