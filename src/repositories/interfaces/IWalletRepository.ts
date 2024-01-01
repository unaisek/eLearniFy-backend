import { IWallet, IWalletTransaction } from "../../models/Wallet";

export interface IWalletRepository {
  createWallet(walletData: Partial<IWallet>): Promise<IWallet>;
  findWalletByUser(userId: string): Promise<IWallet | null>;
  addTransctionToWallet(
    userId: string | undefined,
    transactionsData: IWalletTransaction
  ): Promise<void>;
}