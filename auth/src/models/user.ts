import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
	email: string;
	password: string;
}

// An interface that describes the properties
// a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		// Transform JSON id for the possibility of using services with sql db
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password; // delete keyword in js remove property from object
				delete ret.__v;
			},
		},
	}
);

userSchema.pre<UserDoc>("save", async function(next) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.password);
		this.password = hashed;
	}
	next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
