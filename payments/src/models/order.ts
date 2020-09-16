import mongoose from "mongoose";
import { OrderStatus } from "@hjtickets/common";

export { OrderStatus };

interface OrderAttrs {
	id: string;
	status: OrderStatus;
	version: number;
	userId: string;
	price: number;
}

interface OrderDoc extends mongoose.Document {
	status: OrderStatus;
	version: number;
	userId: string;
	price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			enum: OrderStatus,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order({
		_id: attrs.id,
		status: attrs.status,
		version: attrs.version,
		userId: attrs.userId,
		price: attrs.price,
	});
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
