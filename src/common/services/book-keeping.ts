import { Employee } from '../models/employee';
import { EmployeeRepoInterface } from '../repo/contracts';

const RELEASE_TYPE_MONTHLY = 'MONTHLY';
const RELEASE_TYPE_DAILY = 'DAILY';

export class BookkeepingService {
  #employeeRepo: EmployeeRepoInterface;

  constructor(employeeRepo: EmployeeRepoInterface) {
    this.#employeeRepo = employeeRepo;
  }


  _calculateSalary(releaseType: string, salary: number): number {
    switch (releaseType) {
      case RELEASE_TYPE_MONTHLY:
        return Math.round(salary / 30);
      case RELEASE_TYPE_DAILY:
        return salary;
      default:
        throw new Error(`Unsupported release type: ${releaseType}`);
    }
  }

  async updateEmployeeBalance(employee: Employee): Promise<void> {
    const calculator = this._calculateSalary(employee.releaseType, employee.salary);

    return await this._makeEntry(employee, calculator);
  }

  async _makeEntry(employee: Employee, dailySalary: number): Promise<void> {
    return this.#employeeRepo
      .updateBalance(employee.id, dailySalary)
      .then(() => {
        console.log("Salary balance updated", { "employeeId": employee.id });
      });
  }
};
