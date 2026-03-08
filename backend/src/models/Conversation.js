import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  type: { type: String, enum: ['private', 'group'], required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: String, // Group only
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

schema.index({ participants: 1, updatedAt: -1 }); // Fast list queries

export default mongoose.model('Conversation', schema);