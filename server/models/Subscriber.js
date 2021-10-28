const mongoose = require('mongoose');
const Schema = require('mongoose');

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId, //Id만 알아도 유저 모델에 있는 데이터들을 모두 가져올 수 있다.
        ref: 'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
}, {timestamps: true}) // 만든 날짜와 업데이트된 날짜가 표시되게 된다.




const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }