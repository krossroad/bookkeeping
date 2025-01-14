import { Employee } from "../models/employee";

export interface BookkeepingRepoIntreface {
  makeEntry(employeeId: number, amount: number): Promise<void>;
  withDraw(employeeId: number, amount: number): Promise<void>;
}

export interface EmployeeRepoInterface {
  updateBalance(employeeId: string, amount: number, recordDate: Date): Promise<Employee | null>;
}

