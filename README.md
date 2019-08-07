## MongoDB

MongoDB is a **NoSQL** database, not a relational database (like PostgreSQL, MySQL etc.)  
Instead of tables, columns... , we have the concept of '**documents**'
Syntax is close to JSON, so pairs really well with JavaScript

### Install MongoDB

- locally
- in the cloud (using Atlas) => **this project**

### Create a clustor

- Cloud Provider: **AWS**
- Cloud Region (should be free tier available): **Frankfurt (eu-central-1)**
- Cluster Tier (free tier): **M0 Sandbox (Shared RAM, 512 MB storage) - Encrypted**
- Cluster Name: **DevConnector**

### Create your first database user

_left-hand menu_ > SECURITY > Database Access

**Add new user** with the following privileges: "Read and write to any database"

### Whitelist your IP address

_left-hand menu_ > SECURITY > Network Access

For a real application, whitelist your **own IP address**

## Dependencies

- **express**: a server-side web framework for Node.js (https://expressjs.com/)
- **config**: create default parameters stored in configuration files (config/default.json); extend them for different deployment environments (development, QA, staging, production) (https://www.npmjs.com/package/config)
- **mongoose**: acts as an intermediate between MongoDB and a server-side language like Node.js (https://mongoosejs.com/docs/index.html)
