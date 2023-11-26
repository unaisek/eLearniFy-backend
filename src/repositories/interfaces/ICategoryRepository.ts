import { Icategory } from "../../models/Category";

export interface ICategoryRepository{
    createCategory(category:Icategory): Promise<Icategory | null>;
    getCatergories():Promise < Icategory[]>;
}