import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const currentPassword = await prisma.currentPassword.create({
    data: { password: 1, message: "" }
  })

  const totalPasswords = await prisma.sessionTotal.create({
    data: { quantity: 0, updatedAt: null, closedAt: null }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect()
    process.exit(1);
  });