import { SQSClient, ReceiveMessageCommand, Message, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { BookkeepingService } from '../common/services/book-keeping';
import { Employee } from '@prisma/client';

export class AppWorker {
  sqsClient: SQSClient;
  queueUrl: string;
  bookkeepingSvc: BookkeepingService;

  constructor(sqsClient: SQSClient, queueUrl: string, bookkeepingSvc: BookkeepingService) {
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
    this.bookkeepingSvc = bookkeepingSvc;
  }

  async listen() {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });

    while (true) {
      const res = await this.sqsClient.send(command);
      if (res && res.Messages && res.Messages.length > 0) {
        for (const message of res.Messages) {
          await this.processMessage(message);
        }
        continue;
      }

      // Set a timer to wait for 500ms before checking for new messages again.
      setTimeout(() => { }, 500);
    }
  }

  async processMessage(message: Message) {
    const body = JSON.parse(message.Body ?? '');
    const employee = body as Employee;

    await this.bookkeepingSvc.updateEmployeeBalance(employee);

    await this.sqsClient.send(new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    }));
  }
};
