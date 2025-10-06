# ADET

<div>
<h3>TREE</h3>
<pre>
📦 NEXTJS
├── 🗂️ migrations
│   └── 📄 scheme.sql
│
├── 📁 node_modules
│
├── 📁 src
│   ├── 🔐 auth
│   │   ├── 📄 auth.controller.ts
│   │   ├── 📄 auth.module.ts
│   │   ├── 📄 auth.service.ts
│   │   ├── 🔑 jwt.strategy.ts
│   │   └── 🛡️ jwt-auth.guard.ts
│   │
│   ├── 🛢 database
│   │   ├── 📄 database.module.ts
│   │   └── 📄 database.service.ts
│   │
│   └── 👤 users
│       ├── 📄 users.controller.ts
│       ├── 📄 users.module.ts
│       └── 📄 users.service.ts
│
├── ⚙️ .env
├── 🙈 .gitignore
├── 📦 package-lock.json
├── 📦 package.json
├── 🧾 tsconfig.json
└── 🌳 tree.txt
</pre>
</div>

<div>
<h3>Installations / Dependencies</h3>
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata rxjs
npm install @nestjs/jwt passport passport-jwt
npm install bcryptjs   # or bcrypt
npm install @nestjs/config
npm install @nestjs/typeorm typeorm mysql2   # Or pg if using Postgres
npm install class-validator class-transformer

npm install -D typescript ts-node @types/node ts-node-dev

</div>
