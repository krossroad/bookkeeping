import { PrismaClient } from "@prisma/client";
import { EmployeeRepoInterface } from "./contracts";
import { Employee } from "../models/employee";

export class EmployeeRepo implements EmployeeRepoInterface {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  findById(id: string): Promise<Employee | null> {
    return this.#prismaClient.employee.findUnique({ where: { id } });
  }

  updateBalance(employeeId: string, amount: number): Promise<Employee | null> {
    const now = new Date();
    const queryDate = new Date(now.toLocaleDateString() + ' UTC');
    return this.#prismaClient.employee.update({
      where: {
        id: employeeId,
        salaryAccountedTill: {
          lt: queryDate,
        }
      },
      data: {
        salaryBalance: { increment: amount },
        salaryAccountedTill: queryDate,
      }
    }).catch((error) => {
      console.error("Error updating employee balance:");
      return null;
    });
  }
};
