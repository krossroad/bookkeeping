import { Prisma } from '@prisma/client';

export type Employee = Prisma.EmployeeGetPayload<{}>;
