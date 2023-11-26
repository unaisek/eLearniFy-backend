import { Icategory } from "../models/Category";
import CategoryRepository from "../repositories/CategoryRepository";
import { ICategoryService } from "./interfaces/ICategoryService";

export default class CatogoryService implements ICategoryService{

    private _categoryRepository: CategoryRepository;

    constructor(){
        this._categoryRepository = new CategoryRepository();
    }

    async createCategory(category: Icategory): Promise<Icategory | null> {
        try {            
            return await  this._categoryRepository.createCategory(category);            
        } catch (error) {
            throw Error
        }
    }

     async getAllCategory(): Promise<Icategory[]> {
        try {

            return await this._categoryRepository.getCatergories();
            
        } catch (error) {
            throw Error
        }
    }
}