# Chamador T3 Stack + WebSockets

## Development:
- npm install
- cp .env.example .env
- Set the DB Credentials on .env DATABASE_URL
- Set the WSS Port on .env WSS_PORT
- npx prisma db push
- npx prisma db seed
- npm run dev

## Production:
- npm install
- cp .env.example .env
- Set the DB Credentials on .env DATABASE_URL
- Set the WSS Port on .env WSS_PORT
- Set NODE_ENV="production" on .env
- Set the application's Port at the package.json "prod" script
- npx prisma db push
- npx prisma db seed
- npm run prod
