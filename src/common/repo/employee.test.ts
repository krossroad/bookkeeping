import { PrismaClient } from "@prisma/client";
import { EmployeeRepo } from "./employee";
import { Employee } from "../models/employee";
import { describe, it, expect } from "@jest/globals";

jest.mock("@prisma/client");

describe("EmployeeRepo", () => {
  let prismaClient: PrismaClient;
  let employeeRepo: EmployeeRepo;

  beforeEach(() => {
    prismaClient = {
      employee: {
        update: jest.fn(),
      },
    } as unknown as PrismaClient;
    employeeRepo = new EmployeeRepo(prismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const now = new Date();

  describe("updateBalance", () => {
    it("should update the employee balance and return the updated employee", async () => {
      const employeeId = "1";
      const amount = 100;
      const updatedEmployee: Employee = {
        id: employeeId,
        salaryBalance: 200,
        salaryAccountedTill: now,
        firstName: "",
        lastName: "",
        email: "",
        salary: 0,
        companyId: "",
        idType: "PASSPORT",
        idNumber: "",
        releaseType: "MONTHLY",
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };

      prismaClient.employee.update = jest
        .fn()
        .mockResolvedValue(updatedEmployee);

      const queryDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const result = await employeeRepo.updateBalance(employeeId, amount, queryDate);

      expect(prismaClient.employee.update).toHaveBeenCalledWith({
        where: {
          id: employeeId,
          salaryAccountedTill: {
            lt: expect.any(Date),
          },
        },
        data: {
          salaryBalance: { increment: amount },
          salaryAccountedTill: expect.any(Date),
        },
      });
      expect(result).toEqual(updatedEmployee);
    });

    it("should return null if there is an error updating the employee balance", async () => {
      const employeeId = "1";
      const amount = 100;

      prismaClient.employee.update = jest
        .fn()
        .mockRejectedValue(new Error("Update error"));

      const queryDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const result = await employeeRepo.updateBalance(employeeId, amount, queryDate);

      expect(prismaClient.employee.update).toHaveBeenCalledWith({
        where: {
          id: employeeId,
          salaryAccountedTill: {
            lt: expect.any(Date),
          },
        },
        data: {
          salaryBalance: { increment: amount },
          salaryAccountedTill: expect.any(Date),
        },
      });
      expect(result).toBeNull();
    });
  });
});
