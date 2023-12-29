import Course from "../models/Course";
import Wallet, { IWallet, IWalletTransaction } from "../models/Wallet";
import { IWalletRepository } from "./interfaces/IWalletRepository";

export default class WalletRepository implements IWalletRepository{

    async createWallet(walletData: Partial<IWallet>): Promise<IWallet> {
        try {
            return await Wallet.create(walletData)          
        } catch (error) {
            throw error
        }
    }

    async findWalletByUser(userId: string): Promise<IWallet | null> {
        try {

            return await Wallet.findOne({ userId: userId })
            
        } catch (error) {
            throw error
        }
    }

    async addTransctionToWallet(userId: string, transactionsData: IWalletTransaction): Promise<void> {
        try {

            await Wallet.findOneAndUpdate(
                { userId: userId },
                {
                    $inc: { walletAmount: transactionsData.amount},
                    $push: { transactions: transactionsData }
                }

            )
            
        } catch (error) {
            throw error
        }
    }
}