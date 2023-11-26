import Category ,{Icategory} from "../models/Category";
import { ICategoryRepository } from "./interfaces/ICategoryRepository";

export default class CategoryRepository implements ICategoryRepository{
     async createCategory(category: Partial<Icategory>): Promise<Icategory | null> {
       try {
        return await Category.create(category);
       } catch (error) {
        return null
       }
    }

    async getCatergories(): Promise<Icategory[]> {
        try {
            return await Category.find().exec()
        } catch (error) {
            return []
        }
    }
}
