import { IAdminDashboardData } from "../adminService";

export interface IAdminService{
    getAdminDashboardValue(): Promise<IAdminDashboardData>;
}