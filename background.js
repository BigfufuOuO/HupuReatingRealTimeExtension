//拓展安装时触发
chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension Installed');
});

//处理跨域请求的函数
function makeCORSrequest(url, method, callback) {
    fetch(url, {
        method: method,
        dataType: 'json',
    }).then(function(response) {
        if (response.status == 200) {
            return response.json();
        }
        else {
            throw new Error("Request failed: " + response.statusText);
        }
    }).then(function(data) {
        callback(null, data);
    }).catch(function(error) {
        callback(error, null);
    });
}

//监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "makeCORSrequest") {
        //调用makeCORSrequest函数处理跨域请求
        makeCORSrequest(request.url, "GET", function(err, data) {
            if (!err) {
                //请求成功，将返回的数据发送给content-script
                sendResponse(data);
            }
            else {
                throw new Error(err);
            }
        });
        return true;
    }
});

