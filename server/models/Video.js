const mongoose = require('mongoose');
const Schema = require('mongoose');

const videoSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId, //Id만 알아도 유저 모델에 있는 데이터들을 모두 가져올 수 있다.
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    catogory: {
        type: String
    },
    views : {
        type: Number,
        default: 0 
    },
    duration :{
        type: Number
    },
    thumbnail: {
        type: String
    }
}, {timestamps: true}) // 만든 날짜와 업데이트된 날짜가 표시되게 된다.




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }