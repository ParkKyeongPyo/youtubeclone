const mongoose = require('mongoose');
const Schema = require('mongoose');

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, {timestamps: true}) // 만든 날짜와 업데이트된 날짜가 표시되게 된다.


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }