import { ITutorDashboardData } from "../tutorService";

export interface ITutorService{
    getTutorDashboardValues(tutorId: string): Promise<ITutorDashboardData>;
}