import { BookkeepingService } from "./book-keeping";
import { Employee } from "../models/employee";
import { EmployeeRepoInterface } from "../repo/contracts";
import { describe, it } from "@jest/globals";

describe("BookkeepingService", () => {
  let employeeRepoMock: jest.Mocked<EmployeeRepoInterface>;
  let bookkeepingService: BookkeepingService;

  beforeEach(() => {
    employeeRepoMock = {
      updateBalance: jest.fn().mockReturnValue(new Promise((resolve) => resolve(null))),
    };
    bookkeepingService = new BookkeepingService(employeeRepoMock);
  });

  describe("_calculateSalary", () => {
    it("should calculate daily salary for monthly release type", () => {
      const salary = 3000;
      const releaseType = "MONTHLY";
      const dailySalary = bookkeepingService._calculateSalary(
        releaseType,
        salary,
      );
      expect(dailySalary).toBe(Math.round(salary / 30));
    });

    it("should return the same salary for daily release type", () => {
      const salary = 100;
      const releaseType = "DAILY";
      const dailySalary = bookkeepingService._calculateSalary(
        releaseType,
        salary,
      );
      expect(dailySalary).toBe(salary);
    });

    it("should throw an error for unsupported release type", () => {
      const salary = 100;
      const releaseType = "WEEKLY";
      expect(() =>
        bookkeepingService._calculateSalary(releaseType, salary),
      ).toThrowError("Unsupported release type: WEEKLY");
    });
  });

  describe("updateEmployeeBalance", () => {
    it("should update employee balance with calculated daily salary", async () => {
      const employee: Employee = {
        id: "1",
        releaseType: "MONTHLY",
        salary: 3000,
        firstName: "",
        lastName: "",
        email: "",
        companyId: "",
        idType: "PASSPORT",
        idNumber: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        salaryAccountedTill: new Date(),
        salaryBalance: 0,
      };

      const dailySalary = Math.round(employee.salary / 30);

      await bookkeepingService.updateEmployeeBalance(employee);

      expect(employeeRepoMock.updateBalance).toHaveBeenCalledWith(
        employee.id,
        dailySalary,
      );
    });

    it("should log a message when balance is updated", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      const employee: Employee = {
        id: "1",
        releaseType: "DAILY",
        salary: 100,
        firstName: "",
        lastName: "",
        email: "",
        companyId: "",
        idType: "PASSPORT",
        idNumber: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        salaryAccountedTill: new Date(),
        salaryBalance: 0,
      };

      await bookkeepingService.updateEmployeeBalance(employee);

      expect(consoleSpy).toHaveBeenCalledWith("Salary balance updated", {
        employeeId: employee.id,
      });

      consoleSpy.mockRestore();
    });
  });
});
