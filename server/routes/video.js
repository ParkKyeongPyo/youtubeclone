const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');


//404에러 클라이언트가 서버와 통신할 수는 있지만 서버가 요청한 바(요청한 페이지)를 찾을 수 없다는 것을 가리키는 HTTP 표준 응답 코드

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) =>  {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true) 
    }
});

const upload = multer({ storage: storage}).single("file");

router.post('/uploadfiles', (req, res) => {
    
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
})


router.post('/thumbnail', (req,res) => {
    
    //썸네일 생성 및 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = 0;

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata); //console.log는 요소를 HTML과 같은 트리 구조로 출력, console.dir는 요소를 JSON과 같은 트리 구조로 출력.
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    
    //썸네일 생성
    ffmpeg(req.body.url) 
        .on('filenames', function(filenames) {
            //1. Eventemitter.on(event, listener) addListener과 once도 사용방법이 같음 emitter에 이벤트를 연결할 객체, event에 이벤트 이름, listener에 이벤트 핸들러를 작성하면 됩니다. addListener() 메소드와 on() 메소드는 서로 같으며 on() 메소드는 이벤트를 계속 연결한 상태를 유지하는 반면 once() 메소드는 한 번만 연결한 후 제거합니다.
            //2. Node는 이벤트를 처리하기 위해서 EventEmitter 라는 클래스를 제공
            console.log('Will generate '+ filenames.join(', '));
            console.log(filenames);
            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function(){
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err})
        })
        .screenshots({
            // Will take screensots at 20%, 40%, 60%, 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            //'%b : input basename (filename without extension)
            filename: 'thumbnail-%b.png'
        })
    
})


router.post('/uploadtoDB', (req, res) => {

    const video = new Video(req.body)

    video.save((err, doc) => {

        if (err) return res.json({ success: false, err})
        return res.json({ success: true})
    })
})


router.post('/getdatalandingpage', (req, res) => {

    Video.find()//find() 모델에 있는 모든 비디오들을 가져온다. 
        .populate('writer') //objectId를 쓰는 모델의 데이터의 경우 출력하거나 가져올때 이를 실제 데이터로 치환해서 js에서 합쳐주는 역할을 함, join은 db에서 합쳐주는 반면 populate는 js단에서 합쳐주기 때문에 성능이 좋지 않아 많이 사용할 경우 성능에 문제가 생길 수 있음
        .exec((err, info) => {
            if(err) return res.json({ success: false, err})
            return res.json({success: true, info}) 
        })

})

//도대체 모델에 _id 부분이 어디있지? => 비디오를 만들때마다 생성되는 비디오 고유의 아이디?
router.post('/videodetailpage', (req, res) => {

    //objectId도 유저 id를 기반으로 만들어진 것이기 때문에 objectId만 알아도 유저에 대한 정보를 가져올 수 있나?
    Video.findOne({"_id" : req.body.videoId})//find() 모델에 있는 모든 비디오들을 가져온다. 
        .populate('writer') //ObjectId는 하나의 document 내에서 유일함이 보장되는 12 byte binary data다. 또한 MongoDB 자체 에서 자동으로 넣어주는 고유값이기에, ObjectId를 통해 다른 컬렉션에 있는 데이터를 참조할 수 있다. 즉, 특정 collection에서 populate 메소드를 이용하면 ObjectId를 기반으로 다른 collection의 정보들을 함께 담아서 출력할 수 있다.
        .exec((err, info) => {
            if(err) return res.json({ success: false, err})
            return res.json({success: true, info})
        })

})


router.post('/sidevideo', (req, res) => {

    Video.find({"writer" : req.body.writer})//find() 모델에 있는 모든 비디오들을 가져온다. 
        .populate('writer') //objectId를 쓰는 모델의 데이터의 경우 출력하거나 가져올때 이를 실제 데이터로 치환해서 js에서 합쳐주는 역할을 함, join은 db에서 합쳐주는 반면 populate는 js단에서 합쳐주기 때문에 성능이 좋지 않아 많이 사용할 경우 성능에 문제가 생길 수 있음
        .exec((err, info) => {
            if(err) return res.json({ success: false, err})
            return res.json({success: true, info}) 
        })

})



module.exports = router;
 