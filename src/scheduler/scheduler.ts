import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { PrismaClient } from '@prisma/client';
import { Employee } from '../common/models/employee';

const _CHUNK_SIZE = 1000;

export class AppScheduler {
  prisma: PrismaClient;
  sqsClient: SQSClient;
  queueUrl: string;

  constructor(prismaClient: PrismaClient, sqsClient: SQSClient, queueUrl: string) {
    this.prisma = prismaClient;
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
  }

  async runScheduledTasks() {
    this.walkThroughEmployee((employee: Employee) => {
      this.queueEmployee(employee);
    });
  }

  async queueEmployee(employee: Employee) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(employee),
      DelaySeconds: 0,
      MessageAttributes: {
        'EmployeeId': {
          DataType: 'String',
          StringValue: employee.id,
        },
      },
    });

    this.sqsClient.send(command).then((data) => {
      console.log(`Message sent to the queue: ${data.MessageId}`);
    }).catch((error) => {
      console.error(`Failed to send message to the queue: ${error}`);
    });
  }

  async walkThroughEmployee(callback: (employee: Employee) => void) {
    let hasMoreTasks = true;
    let skip = 0;

    const currentDate = new Date();
    const today = new Date(currentDate.toLocaleDateString() + ' UTC');

    while (hasMoreTasks) {
      const employees: Employee[] = await this.prisma.employee.findMany({
        take: _CHUNK_SIZE,
        skip,
        where: {
          deletedAt: null,
          salaryAccountedTill: {
            lt: today,
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
      }).then((employees) => {
        employees.forEach(callback);
        return employees;
      });

      skip += _CHUNK_SIZE;
      if (employees.length < _CHUNK_SIZE) { hasMoreTasks = false; }
    }
  }
}
