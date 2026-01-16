import { testPrisma } from "./client";

async function reset() {
  await testPrisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "RecurringRun",
      "RecurringRule",
      "Budget",
      "Transaction",
      "Attachment",
      "Category",
      "FinancialAccount",
      "UserPreferences",
      "Session",
      "Account",
      "VerificationToken",
      "User"
    RESTART IDENTITY CASCADE;
  `);
}

reset()
  .then(async () => {
    await testPrisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await testPrisma.$disconnect();
    process.exit(1);
  });
