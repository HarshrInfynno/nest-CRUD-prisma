import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const password = await hash('123456789', 12);
  for (let i = 1; i <= 50; i++) {
    const userData: Prisma.UserCreateInput = {
      firstName: `test`,
      lastName: `user ${i}`,
      email: `testuser${i}@gmail.com`,
      password,
      isActive: Math.random() < 0.5,
    };
    const user = await prisma.user.create({ data: userData });

    console.log(i);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
