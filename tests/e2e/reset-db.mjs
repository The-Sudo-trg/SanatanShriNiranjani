// Playwright globalSetup — deterministic E2E start state (TESTING.md §13):
// seed-created content stays; user-created rows from earlier runs are cleared;
// notifications are restored to unread=3 so TC-NT-01 is repeatable.
import { PrismaClient } from "@prisma/client";

export default async function resetDb() {
  const prisma = new PrismaClient();
  try {
    await prisma.booking.deleteMany({});
    await prisma.gauContribution.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartLine.deleteMany({});
    await prisma.malaCount.deleteMany({});
    await prisma.volunteer.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.notification.updateMany({ data: { read: false } });
    console.log("✅ E2E DB reset: user rows cleared, notifications marked unread");
  } finally {
    await prisma.$disconnect();
  }
}
