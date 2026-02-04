import mongoose from "mongoose";

export interface IImage {
  md5: string;
  name: string;
  extension: string;
  size: number;
  width: number;
  height: number;
  _id?: string;
  created_at?: Date;
  updated_at?: Date;
  __v?: number;
}

const imageSchema = new mongoose.Schema({
  md5: { type: String, required: true },
  name: { type: String, required: true },
  extension: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  size: { type: Number, required: true },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);
export { Image };
