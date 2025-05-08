# My diplom project

Stack:
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn ui
- mySQL

| Variable         | Description                   | Example / Notes                |
|------------------|------------------------------|-------------------------------|
| `MYSQL_HOST`     | IP of the host machine       | `172.17.0.1`                  |
| `MYSQL_PORT`     | Port of the host machine     | `3306`                        |
| `MYSQL_DATABASE` | MySQL database name          | `<MySQL database name>`        |
| `MYSQL_USER`     | MySQL user                   | `<MySQL user>`                 |
| `MYSQL_PASSWORD` | MySQL password               | `<MySQL password>`             |
| `AUTH_SECRET`    | Secret for authentication    | `<secret for authentication>`  |
| `AUTH_TRUST_HOST`| Trust host for auth          | `true`                         |
| `AUTH_URL`       | URL for authentication       | `<url for authentication>`     |


> **Note**: Also directory /app/src/files should be mounted as volume , to persist contract files.
