import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email    = 'admin@alnadascientific.com';
  const password = 'NadaAdmin2026!';

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where:  { email },
    update: { passwordHash },
    create: { email, passwordHash, role: 'admin' },
  });

  console.log('✅ Admin user ready:', admin.email);
  console.log('🔑 Password:', password);
  console.log('👉 Change this password after first login!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
