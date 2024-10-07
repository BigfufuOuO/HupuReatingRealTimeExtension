/*
NOTE:
    1.在英文语境中，match指的是一场系列赛，例如一整个bo5。game指的是一局比赛，即bo5中的一局。下文中
        比赛代指match，对局代指game。
*/



/*
sendAndRecieve: 发送请求并接收返回的数据.
url: 请求的url
return: 一个Promise对象，resolve的参数为返回的数据。
*/
async function sendAndRecieve(url) {
    if (typeof browser == "undefined") {
        //在浏览器中运行
        browser = chrome;
    }
    return new Promise((resolve, reject) => {
    browser.runtime.sendMessage({ 
        action: "makeCORSrequest",
        url: url,
        }, function(response) {
            //处理返回的数据
            resolve(response);
        });
    });
}

/*
getMatchInfo: 获取系列比赛信息
return: 一个数组，内容为需要展示的比赛信息。
    如果当前有比赛正在进行，则返回正在进行的比赛；
    如果当前没有比赛正在进行，则返回最近结束的比赛，以及下一场比赛。
*/
function getMatchInfo(response) {
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
            else if (match[j].matchStatus == "INPROGRESS") {
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
        else {
            //发起未处理错误
            throw new Error("No match data.");
        }
    }
    else {
        //返回正在进行的比赛。
        return matchOnprogress;
    }
    //返回最近结束的比赛和下一场比赛
    return matchDisplay;
}

/*
getBizId: 获取评分入口BizId. BizId是评分入口的唯一标识符。
response: 比赛信息的返回数据
*/
function getBizId(response) {
    const categories = response.result.categoryList;
    var link = "";
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category.categoryId == "live_score") {
            link = category.link;
            break;
        }
    }
    //格式：https://offline-download.hupu.com/online/prod/310016/match.html?outBizType=lol_match&outBizNo=1711&gameType=lol&matchId=631577583222784
    //如果存在outBizNo，则返回outBizNo
    if (link.indexOf("outBizNo") == -1) {
        //发起未处理错误
        console.log("No outBizNo in link. Please check if it's not in progress.");
        return "0";
    }
    else {
        //找到outBizNo
        const outBizNo = link.split("outBizNo=")[1].split("&")[0];
        return outBizNo;
    }
}

async function getGameBoScore(responseMatch, memberInfos) {
    // 处理memberInfos
    const teams = [];
    for (let i = 0; i < memberInfos.length; i++) {
        teams.push(memberInfos[i].memberName);
    }

    const gameBoGroup = responseMatch.data.subNodes;
    if (gameBoGroup.length == 0) {
        //发起未处理错误
        alert("No gameBoGroup.");
        return;
    }
    else {
        const gameBoBizId = gameBoGroup[gameBoGroup.length - 1].outBizNo;
        // 获取subGroup
        const gameBoSubGroupUrl = "https://games.mobileapi.hupu.com/1/8.0.1/bplcommentapi/bpl/score_tree/getSubGroups?outBizType=lol_bo&outBizNo=" + gameBoBizId;
        const gameBoScores = [];
        // sendAndRecieve(gameBoSubGroupUrl).then((response) => {
        let response = await sendAndRecieve(gameBoSubGroupUrl);
        const gameBoSubGroups = response.data;
        for (let i = 0; i < gameBoSubGroups.length; i++) {
            if (teams.includes(gameBoSubGroups[i].groupName)) {
                const nodeId = gameBoSubGroups[i].rootNodeId;
                const SGnodePageUrl = "https://games.mobileapi.hupu.com/1/8.0.1/bplcommentapi/bff/bpl/score_tree/groupAndSubNodes?queryType=score_high&nodeId=" + nodeId;
                // sendAndRecieve(SGnodePageUrl).then((response) => {
                let responseSubGroup = await sendAndRecieve(SGnodePageUrl);
                const GroupName = responseSubGroup.data.groupInfo.name;
                const GroupScoreData = responseSubGroup.data.nodePageResult.data;
                const GroupScoreDict = {};
                GroupScoreDict.groupName = GroupName;
                GroupScoreDict.groupScore = []
                for (let j = 0; j < GroupScoreData.length; j++) {
                    if (GroupScoreData[j].node.infoJson.type[0] != "bpHero") {
                        GroupScoreDict.groupScore.push(GroupScoreData[j]);
                    }
                }
                gameBoScores.push(GroupScoreDict);
            }
        }
        return gameBoScores;
    }
}

async function getScoreDisplay(matchDisplayArray) {
    let ScoreDisplayArray = [];
    for (let i = 0; i < matchDisplayArray.length; i++) {
        const match = matchDisplayArray[i];
        const memberInfos = match.againstInfo.memberInfos;
        let matchInfo = {};
        matchInfo.title = match.matchIntroduction;
        matchInfo.matchId = match.matchId;
        let startTimeStamp = new Date(Number(match.matchStartTimeStamp));
        matchInfo.startTime = startTimeStamp.toLocaleString();
        matchInfo.memberInfos = memberInfos;
        matchInfo.midGameStageInfo = match.matchStatusDesc;
        // url格式：https://match-api.hupu.com/1/8.0.97/matchallapi/liveTabList?matchId=631577583222784&matchType=lol&crt=1728134786227
        const MatchIdApiUrl = "https://match-api.hupu.com/1/8.0.97/matchallapi/liveTabList?matchType=lol&matchId=" + match.matchId + "&crt=" + Date.now();
        
        // 根据赛程得到BizId
        var responseMatchId = await sendAndRecieve(MatchIdApiUrl);
        const BizId = getBizId(responseMatchId);
        matchInfo.BizId = BizId;
        if (BizId == "0") {
            //发起未处理错误
            ScoreDisplayArray.push(matchInfo);
            continue;
        }

        //获取比赛评分入口
        const MatchBizUrl = "https://games.mobileapi.hupu.com/1/8.0.1/bplcommentapi/bpl/score_tree/getSelfByBizKey?outBizType=lol_match&outBizNo=" + BizId;
        var responseBizId = await sendAndRecieve(MatchBizUrl);
        const gameBoScores = await getGameBoScore(responseBizId, memberInfos);
        matchInfo.gameBoScores = gameBoScores;
        ScoreDisplayArray.push(matchInfo);
    }
    return ScoreDisplayArray;
}

function getTableHTML(url, documentName) {
    fetch(chrome.runtime.getURL(url))
        .then(response => response.text())
        .then(data => {
            documentName.innerHTML = data;
        });
}


/*
返回需要查看的比赛信息 ::未完成::
*/
function getCurrentScore(ScoreDisplayArray) {
    return ScoreDisplayArray[0];
}

function updateContent(currentScore) {
    let titleMain = currentScore.title;
    document.getElementById('current-title').textContent = titleMain;
    let title = "";
    title += currentScore.memberInfos[0].memberName + " "; 
    title += currentScore.memberInfos[0].memberBaseScore + "-";
    title += currentScore.memberInfos[1].memberBaseScore + " ";
    title += currentScore.memberInfos[1].memberName;
    title += "(" + currentScore.midGameStageInfo + ")";
    document.getElementById('caption-current-game').textContent = title;
    titleUrl = "https://m.hupu.com/score/detail.html?outBizType=lol_match&outBizNo=" + currentScore.BizId;
    document.getElementById('link-game').setAttribute('href', titleUrl);

    document.getElementById('team-1').textContent = currentScore.gameBoScores[0].groupName;
    document.getElementById('team-2').textContent = currentScore.gameBoScores[1].groupName;

    /* 如果评分变高，字体变红*/
    let positions = ['top', 'jungle', 'mid', 'adc', 'support', 'coach'];
    for (let team = 1; team < 3; team++) {
        for (let i = 0; i < 6; i++) {
            let trend = "";
            let position = positions[i];
            let playerNamePosition = document.getElementById('team-' + team + '-player-' + position + '-name');
            let playerScorePosition = document.getElementById('team-' + team + '-player-' + position + '-score');
            let playerName = currentScore.gameBoScores[team - 1].groupScore[i].node.name;
            let playerScore = currentScore.gameBoScores[team - 1].groupScore[i].node.scoreAvg;
            if (playerScore > playerScorePosition.textContent) {
                playerScorePosition.style.color = 'red';
                trend = " ▲";
            }
            else if (playerScore < playerScorePosition.textContent) {
                playerScorePosition.style.color = 'green';
                trend = " ▼";
            }
            else {
                playerScorePosition.style.color = 'black';
                trend = " =";
            }
            playerNamePosition.textContent = playerName;
            playerScorePosition.textContent = playerScore + trend;
        }
    }
    
}

/*
对当前比赛的评分进行排序. 按照位置信息。
 */
function sortCurrentScore(currentScore) {
    return ;
}



//根据url发送CORS
async function fetchAndUpdate() {
    //获取当前时间
    let unixTimestamp = Date.now();
    //拼接url，进行fetch
    let url = "https://match-api.hupu.com/1/8.0.97/matchallapi/bff/standard/getTabDetailScheduleList?categoryType=common&enType=lol&direction=current&crt=" + unixTimestamp;
    let responseUrl = await sendAndRecieve(url);
    const matchDisplayArray = getMatchInfo(responseUrl);
    const ScoreDisplayArray = await getScoreDisplay(matchDisplayArray);
    console.log(ScoreDisplayArray);
    const currentScore = getCurrentScore(ScoreDisplayArray);

    if (!document.getElementById('score-board')) {
        const iframe = document.createElement('div');
        iframe.classList.add('floating-text');
        iframe.id = 'score-board';
        getTableHTML('table.html', iframe);

        document.body.appendChild(iframe);
        let isDragging = false;
        let offsetX, offsetY;
        
        iframe.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - iframe.offsetLeft;
            offsetY = e.clientY - iframe.offsetTop;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                iframe.style.left = `${e.clientX - offsetX}px`;
                iframe.style.top = `${e.clientY - offsetY}px`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    else {
        updateContent(currentScore);
    }
}

fetchAndUpdate();
//3秒后更新数据
setTimeout(fetchAndUpdate, 3000);


setInterval(fetchAndUpdate, 10086);