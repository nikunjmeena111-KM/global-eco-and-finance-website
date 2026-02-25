import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {  name:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    },
    code: {
      type: String,
      required: true,
      //unique: true,
      uppercase: true,
      trim: true
    },

    indexSymbol: {
      type: String,
      default:null,
      trim: true
    },

    capitalGainsTax: {
      type: String,
      
    },

    dividendTax: {
      type: String,
      
    },
    exchanges: [
  {
    name: String,        // "NSE"
    code: String,        // "NSE"
    indexSymbol: String  // "NIFTY"
  }
],

    brokerageAvg: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

console.log("Country model loaded");

export const Country = mongoose.model("Country", countrySchema);