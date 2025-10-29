# @polar/backend

## Configuration

The **Polar's backend tech stack** contains some tools that improves the api development, performance and security.

First of all there is the main **MySQL (or MariaDB)** database, and the in-memory cache provided by **Redis** we can easily configure it out with:

- Installing **MariaDB**:
  
  - ```bash
    sudo apt install mariadb-server # Ubuntu/Debian
    sudo pacman -S mariadb # Arch Linux
    ```

- Enabling and starting the daemon:
  
  - ```bash
    sudo systemctl enable mariadb.service # Enable the service
    sudo systemctl start mariadb.service # Start the service
    
    systemctl status mariadb.service # Check the status
    ```

- Installing **Redis:**
  
  - ```bash
    sudo apt install redis # Ubuntu/Debian
    sudo pacman -S redis # Arch Linux
    ```

- Enabling and starting the daemon:
  
  - ```bash
    sudo systemctl enable redis.service # Enable the service
    sudo systemctl start redis.service # Start the service
    
    systemctl status redis.service # Check the status (active)
    ```

Once have configured all the data stores we can install dependencies:

```bash
# You need to use pnpm
npm i -g pnpm

pnpm install # Install all packages' dependency
```
