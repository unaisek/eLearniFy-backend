import { Icategory } from "../../models/Category";

export interface ICategoryService{
    createCategory(category:Icategory ): Promise <Icategory| null>;
    getAllCategory():Promise <Icategory[]>;
}