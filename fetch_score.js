//获取当前时间
const unixTimestamp = Date.now();
//拼接url，进行fetch
const url = "https://match-api.hupu.com/1/8.0.97/matchallapi/bff/standard/getTabDetailScheduleList?categoryType=common&enType=lol&direction=current&crt=" + unixTimestamp;
//根据url发送请求
fetch(url, {
    method: 'GET',
    dataType: 'jsonp',
    headers: {
        'Content-Type': 'application/json',
    }
}).then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).then(function(json) {
        console.log(json);
    });
