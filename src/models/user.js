import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// User Schema

const userSchema=new mongoose.Schema({
    name: {type: String},
    role:{
        type: String,
        enum: ["Customer","Admin","DeliveryPartner"],
        required: true,
    },
    isActivated: {type: Boolean, default: false},
});

//Customer Schema

const customerSchema=new mongoose.Schema({
    ...userSchema.obj,
    phone: { type: Number, required: true, unique: true},
    role: { type: String, enum: ["Customer"], default: "Customer"},
    liveLocation: {
        latitude: {type: Number},
        longitude: {type: Number},
    },
    address:{type: String},
});

//Delivery Partner Schema

const deliveryPartnerSchema=new mongoose.Schema({
    ...userSchema.obj,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: { type: Number, required: true, unique: true},
    role: { type: String, enum: ["DeliveryPartner"], default: "DeliveryPartner"},
    liveLocation: {
        latitude: {type: Number},
        longitude: {type: Number},
    },
    address:{type: String},
    branch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    },
});

deliveryPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//Admin Schema

const adminSchema=new mongoose.Schema({
    ...userSchema.obj,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: { type: String, enum: ["Admin"], default: "Admin"},
});

export const Customer=mongoose.model("Customer", customerSchema);
export const DeliveryPartner=mongoose.model("DeliveryPartner", deliveryPartnerSchema);
export const Admin=mongoose.model("Admin", adminSchema);