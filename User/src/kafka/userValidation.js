import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Update based on your Kafka setup
});

// Create Kafka Producer
const producer = kafka.producer();
const initProducer = async () => {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected.");
  } catch (error) {
    console.error("❌ Kafka Producer connection error:", error);
  }
};

// Create Kafka Consumer
const consumer = kafka.consumer({ groupId: "user-group" });
const initConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "user-login", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        const messageData = JSON.parse(messageValue);

        console.log(`📩 Received message: ${messageData}`);

        // Here, you can process the message as needed (e.g., store login events in a database)
      },
    });

    console.log("✅ Kafka Consumer connected.");
  } catch (error) {
    console.error("❌ Kafka Consumer connection error:", error);
  }
};

// Function to send a test message
// const sendTestMessage = async () => {
//   try {
//     await producer.send({
//       topic: "usert", // Topic to send the message to
//       messages: [
//         {
//           value: "Hello, Kafka!", // Message content
//         },
//       ],
//     });
//     console.log("📤 Test message sent successfully!");
//   } catch (error) {
//     console.error("❌ Failed to send test message:", error);
//   }
// };

// Initialize Kafka
const initKafka = async () => {
  await initProducer();
  await initConsumer();
  // await sendTestMessage();
};

export { producer, initConsumer, initKafka };
