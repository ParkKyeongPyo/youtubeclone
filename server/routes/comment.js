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
            Comment.findOne({'writer': info.writer, 'postId': info.postId, 'content': info.content})
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
        else {
            Comment.findOne({'writer': doc.writer, 'postId': doc.postId, 'content': doc.content, 'responseTo': doc.responseTo })
                .populate('writer')
                .exec((err,info) => {
                    if (err) return res.json({success: false, err})
                    return res.json({success: true, info, message: 'singlecomment를 comment모델에 추가했습니다.'})
                })
        }  
    })
})





module.exports = router;
