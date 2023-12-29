
import mongoose,{ Document, model,Schema } from "mongoose";

export interface IWalletTransaction {
  amount: number;
  transactionType: string;
  description?:string
  date?: Date;
}

export interface IWallet extends Document{
    userId?: string;
    walletAmount?: number,
    transactions: IWalletTransaction[];    
}

const walletSchema = new Schema<IWallet>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    walletAmount:{
        type: Number,
        default: 0
    },
    transactions:[{
        amount:{
            type: Number,
            required:true
        },
        transactionType:{
            type: String,
            required: true
        },
        description:{
            type: String
        },
        date:{
            type: Date,
            default: Date.now()
        }
        
    }]
})


export default model<IWallet>('Wallet',walletSchema)
