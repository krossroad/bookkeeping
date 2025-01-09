import schedule from 'node-schedule';
import { PrismaClient } from '@prisma/client';
import { AppScheduler } from './scheduler';
import { SQSClient, CreateQueueCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

// boot dotenv
dotenv.config();

const prisma = new PrismaClient({});
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_SQS_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

async function createSQSQueue() {
  const cmd = new CreateQueueCommand({ QueueName: "employee-salary-porecessor" });
  let url = '';

  await sqsClient.send(cmd).then(res => {
    if (res && res.QueueUrl) {
      url = res.QueueUrl;
      console.log(`Created SQS Queue: ${url}`);
      return
    }
  }).catch((err) => {
    console.error(`Failed to create queue: ${err}`);
    process.exit(1);
  });

  return url;
}

(async () => {
  const scheduler = new AppScheduler(prisma, sqsClient, await createSQSQueue());
  schedule.scheduleJob('0,10,30,40,50 * * * * *', () => scheduler.runScheduledTasks());
})();
