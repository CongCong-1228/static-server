var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method


    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)


    response.statusCode = 200
    // 默认首页（当路径为/是默认为index.html）
    const filePath = path === '/' ? '/index.html' : path
    // 通过路径判断content-type类型
    const index = filePath.lastIndexOf('.')
    const suffix = filePath.substring(index)
    // 使用哈希表的形式
    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }
    // 设置保底值为'text/html'
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
    let content
    // 当文件不存在时，捕获错误，设置为404
    try {
        content = fs.readFileSync(`./public${filePath}`).toString()
    } catch (error) {
        content = '文件不存在'
        response.statusCode = 404
    }
    response.write(content)
    response.end()
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)