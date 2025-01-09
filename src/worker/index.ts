import dotenv from 'dotenv';
import { SQSClient } from '@aws-sdk/client-sqs';
import { AppWorker } from './worker';
import { BookkeepingService } from '../common/services/book-keeping';
import { EmployeeRepo } from '../common/repo/employee';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_SQS_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});


const prismaClient = new PrismaClient();
const repo = new EmployeeRepo(prismaClient);
const bookkeepingSvc = new BookkeepingService(repo);
const queueURL = process.env.AWS_SQS_QUEUE_URL ?? '';

(async () => {
  const appWorker = new AppWorker(sqsClient, queueURL, bookkeepingSvc);
  appWorker.listen();
})();
