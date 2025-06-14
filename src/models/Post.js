import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['business', 'tech', 'weather', 'automotive', 'pakistan', 
           'global', 'health', 'sports', 'islam', 'education', 'entertainment']
  },
  imageUrl: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make author optional since we only have admin users
  },
  comments: [{
    user: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model exists before creating it
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
