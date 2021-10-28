const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");
const { Video } = require("../models/Video");


router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({'userTo' : req.body.userTo })
        .exec((err, SubscribeNumber) => {
            if (err) return res.json({ success: false, err})
            return res.json({ success: true, subscribeNumber: SubscribeNumber.length})
        })
})


router.post('/subscribestate', (req, res) => {

    Subscriber.find({'userTo' : req.body.userTo, 'userFrom': req.body.userFrom})
        .exec((err, Subscribe) => {
            if (err) return res.json({ success: false, err})
            else {
                let result = false;
                if(Subscribe.length !== 0){
                    result = true;
                }
                return res.json({ success: true, SubscribeState: result})
            }
        })
})

router.post('/addsubscribe', (req, res) => {
    
    const subscriber = new Subscriber(req.body);

    subscriber.save((err, info) => {
            if (err) return res.json({ success: false, err})
            return res.json({ success: true, message: "DB에서 구독정보 추가 성공"})
    }
)})

router.post('/removesubscribe', (req, res) => {
    
    Subscriber.findOneAndDelete({'userTo' : req.body.userTo, 'userFrom': req.body.userFrom})
        .exec((err, info) => {
            if (err) return res.json({ success: false, err})
            return res.json({ success: true, message: "DB에서 구독정보 제거 성공"})
        })
})

router.post('/getsubscribed', (req, res) => {

    Subscriber.find({'userFrom': req.body.userFrom})
        .exec((err, Subscribed) => {
            if (err) return res.json({ success: false, err})
            else {
                subscribelist = [];
                Subscribed.map((Subscribe, i) => {
                    subscribelist.push(Subscribe.userTo)
                })

                Video.find({'writer': {$in: subscribelist}})
                    .populate('writer')
                    .exec((err, SubscribeVideo) => {
                        if (err) return res.json({success: false, err})
                        return res.json({success: true, SubscribeVideo})
                    })
            }
        })
})



module.exports = router;
