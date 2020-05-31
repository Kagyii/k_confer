const router = require('express').Router();


module.exports = router.get('/route', (req, res, next) => {

    return res.json({
        route : ['/api/admin/route'],
        authentication : ['/api/user/signup', '/api/user/login', '/api/user/logout'],
        newsfeed: ['/api/user/newsfeed/post'],
        profile: ['/api/user/profile/get', '/api/user/profile/setup'],
        post: ['/api/user/post/create', '/api/user/post/like', '/api/user/post/undoLike',
         '/api/user/post/delete', '/api/user/post/share', '/api/user/post/comment/write',
        '/api/user/post/comment/get', '/api/user/post/comment/edit', '/api/user/post/comment/delete'],
        search: ['/api/user/search/profiles'],
        suggestion: ['/api/user/suggestion/profileSetup']
    })
    
})




