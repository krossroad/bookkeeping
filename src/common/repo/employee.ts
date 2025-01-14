import { PrismaClient } from "@prisma/client";
import { EmployeeRepoInterface } from "./contracts";
import { Employee } from "../models/employee";

export class EmployeeRepo implements EmployeeRepoInterface {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async updateBalance(
    employeeId: string,
    amount: number,
  ): Promise<Employee | null> {
    const now = new Date();
    const queryDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    return this.#prismaClient.employee
      .update({
        where: {
          id: employeeId,
          salaryAccountedTill: {
            lt: queryDate,
          },
        },
        data: {
          salaryBalance: { increment: amount },
          salaryAccountedTill: queryDate,
        },
      })
      .catch(() => {
        console.error("Error updating employee balance:");
        return null;
      });
  }
}
