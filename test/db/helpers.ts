import { testPrisma } from "./client";
import { defaultDashboardLayout } from "@/lib/preferences";

export async function resetDb() {
  await testPrisma.$transaction([
    testPrisma.recurringRun.deleteMany(),
    testPrisma.transaction.deleteMany(),
    testPrisma.recurringRule.deleteMany(),
    testPrisma.budget.deleteMany(),
    testPrisma.attachment.deleteMany(),
    testPrisma.category.deleteMany(),
    testPrisma.financialAccount.deleteMany(),
    testPrisma.userPreferences.deleteMany(),
    testPrisma.session.deleteMany(),
    testPrisma.account.deleteMany(),
    testPrisma.verificationToken.deleteMany(),
    testPrisma.user.deleteMany(),
  ]);
}

export async function seedUser(email?: string) {
  const uniqueEmail =
    email ?? `test+${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const user = await testPrisma.user.create({
    data: {
      email: uniqueEmail,
      passwordHash: "$2b$10$8SYQ9Y8d7Q8QJ6/T83L7UuLMdYJQdCWioZGMkVnW5lL.2X4JLTtZ2", // Password123!
      preferences: {
        create: {
          currency: "USD",
          dashboardLayout: defaultDashboardLayout,
        },
      },
    },
  });

  return user;
}
