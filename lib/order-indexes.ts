import Order from "@/models/Order";

let orderIndexesReady: Promise<void> | null = null;

export function ensureOrderIndexes() {
  if (orderIndexesReady) {
    return orderIndexesReady;
  }

  orderIndexesReady = (async () => {
    const indexes = await Order.collection.indexes();
    const transactionIndex = indexes.find(
      (index: { name?: string }) => index.name === "transactionId_1",
    );

    const hasExpectedPartialFilter =
      transactionIndex?.partialFilterExpression?.transactionId?.$type === "string";

    if (!hasExpectedPartialFilter && transactionIndex) {
      await Order.collection.dropIndex("transactionId_1");
    }

    await Order.collection.createIndex(
      { transactionId: 1 },
      {
        name: "transactionId_1",
        unique: true,
        partialFilterExpression: {
          transactionId: { $type: "string" },
        },
      },
    );
  })().catch((error) => {
    orderIndexesReady = null;
    throw error;
  });

  return orderIndexesReady;
}
