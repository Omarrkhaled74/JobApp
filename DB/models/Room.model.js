import mongoose, { model, Schema, Types } from "mongoose";
const roomSchema = new Schema(
  {
    users: [String],
    name: {
      required: true,
      type: String,
      unique: true,
      minlength: 2,
      maxlength: 25,
    },
    createdBy: {
      required: true,
      type: Types.ObjectId,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

roomSchema.virtual("id").get(function () {
  return this._id.toString();
});

roomSchema.virtual("message", {
  localField: "_id",
  foreignField: "roomId",
  ref: "Message",
});

export const roomModel = mongoose.models.Room || model("Room", roomSchema);
