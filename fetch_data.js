//获取当前时间
const unixTimestamp = Date.now();
//拼接url，进行fetch
const url = "https://match-api.hupu.com/1/8.0.97/matchallapi/bff/standard/getTabDetailScheduleList?categoryType=common&enType=lol&direction=current&crt=" + unixTimestamp;
//根据url发送CORS
chrome.runtime.sendMessage({ 
    action: "makeCORSrequest",
    url: url,
    data: null
}, function(response) {
    //处理返回的数据
    const matchDisplayArray = getGameInfo(response);
    
});

function getGameInfo(response) {
    //处理返回的schedule数据
    const schedule_days = response.result.dayGameData;
    const matchCompeletd = [];
    const matchOnprogress = [];
    const matchNotstarted = [];
    for (let i = 0; i < schedule_days.length; i++) {
        const schedule_day = schedule_days[i];
        const match = schedule_day.matchData;
        for (let j = 0; j < match.length; j++) {
            if (match[j].matchStatus == "COMPLETED") {
                matchCompeletd.push(match[j]);
            }
            else if (match[j].matchStatus == "ONPROGRESS") {
                matchOnprogress.push(match[j]);
            }
            else {
                matchNotstarted.push(match[j]);
            }
        }
    }

    const matchDisplay = [];
    if (matchOnprogress.length == 0) {
        if (matchCompeletd.length > 0 && matchNotstarted.length > 0) {
            matchDisplay.push(matchCompeletd[matchCompeletd.length - 1]);
            matchDisplay.push(matchNotstarted[0]);
        }
        else if (matchCompeletd.length > 0) {
            matchDisplay.push(matchCompeletd[matchCompeletd.length - 1]);
        }
        else if (matchNotstarted.length > 0) {
            matchDisplay.push(matchNotstarted[0]);
        }
        //否则无比赛
    }
    else {
        return matchOnprogress;
    }

    return matchDisplay;
}

function getScoreDisplay(matchDisplayArray) {
    const ScoreDisplayArray = [];
    for (let i = 0; i < matchDisplayArray.length; i++) {
        const match = matchDisplayArray[i];
        const matchInfo = {};
        matchInfo.title = match.matchInfo;
        
    }
}
