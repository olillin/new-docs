-- CreateTable
CREATE TABLE "ApiClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "scope" TEXT NOT NULL,

    CONSTRAINT "ApiClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiClient_name_key" ON "ApiClient"("name");
