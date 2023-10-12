import {OrderStatus} from '@ticketing-services/common'
import mongoose from "mongoose";
import {TicketDoc} from "./ticket";

export {OrderStatus}

interface OrderAttrs {
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    userId: string;
}

export interface OrderDoc extends mongoose.Document<OrderAttrs> {
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    userId: string;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderAttrs> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: OrderStatus,
            default: OrderStatus.Created
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ticket'
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            }
        }
    }
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('order', orderSchema)

export {Order}
