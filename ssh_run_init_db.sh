#!/usr/bin/expect -f
set timeout 30
set host "root@94.183.184.106"
set password "Code2025#"

spawn ssh $host "cd /var/www/dacha && docker compose exec backend python -m app.db.init_db"
expect {
    "password:" {
        send "$password\r"
    }
}
expect eof
