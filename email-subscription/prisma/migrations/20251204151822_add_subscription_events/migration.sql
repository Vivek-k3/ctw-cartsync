-- CreateTable
CREATE TABLE "SubscriptionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "SubscriptionEvent_shop_createdAt_idx" ON "SubscriptionEvent"("shop", "createdAt");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_email_idx" ON "SubscriptionEvent"("email");
