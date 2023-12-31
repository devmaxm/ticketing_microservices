import {OrderStatus} from '@ticketing-services/common'
import mongoose from "mongoose";
import {TicketDoc} from "./ticket";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export {OrderStatus}

interface OrderAttrs {
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    userId: string;
}

export interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    userId: string;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);


orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('order', orderSchema)

export {Order}
