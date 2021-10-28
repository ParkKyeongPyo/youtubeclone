const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Comment } = require("../models/Comment");

router.post('/allcommentget', (req,res) => {

    Comment.find({'postId': req.body.postId})
        .populate('writer') 
        .exec((err,comment) => {
            if (err) return res.json({success: false, err})
            return res.json({success: true, comment, message: "비디오에 대한 모든 댓글 가져옴"})
        })
})


router.post('/sendcomment', (req, res) => {

    const comment = new Comment(req.body);

    comment.save((err, info) => {
        if (err) return res.json({success: false, err})
        else {
            Comment.find({'writer': info.writer})
                .populate('writer')
                .exec((err,doc) => {
                    if (err) return res.json({success: false, err})
                    return res.json({success: true, doc, message: "comment model 전송 성공"})
                })
        }
    })

})


router.post('/sendsinglecomment', (req, res) => {

    const comment = new Comment(req.body);

    comment.save((err, doc) => {
        if (err) return res.json({sucess: false, err})
        return res.json({success: true, doc, message: 'singlecomment를 comment모델에 추가했습니다.'})
    })
})





module.exports = router;
