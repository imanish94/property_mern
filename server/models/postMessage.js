import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    location: String,
    lat: Number,
    long : Number,
    pincode : String,
    price : Number,
    selectedFile: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;