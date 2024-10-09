

document.addEventListener('DOMContentLoaded', function() {
    //获取当前页面的dark-mode状态
    chrome.storage.local.get('enableDarkMode', function(result) {
        const isDarkMode = result.enableDarkMode;
        console.log(isDarkMode);
        if (isDarkMode) {
            document.getElementById('setting-profile-black').setAttribute('checked', true);
        }
        else
        {
            document.getElementById('setting-profile-light').setAttribute('checked', true);
        }
    });

    document.getElementById('setting-profile-black').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: setThemeDark
            });
        });
        //将其checked属性加入
        this.setAttribute('checked', true);
    });

    document.getElementById('setting-profile-light').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: setThemeLight
            });
        });
        //将其checked属性加入
        this.setAttribute('checked', true);
    });
});

function setThemeDark() {
    const floating_text = document.querySelector('.floating-text');
    //如果已经是dark-mode，不变
    if (floating_text.getAttribute('theme') === 'dark') {
        return ;
    }
    floating_text.setAttribute('theme', 'dark');
    const isDarkMode = true;
    //持久化
    chrome.storage.local.set({ enableDarkMode: isDarkMode });
}

function setThemeLight() {
    const floating_text = document.querySelector('.floating-text');
    //如果已经是light-mode，不变
    if (floating_text.getAttribute('theme') === 'light') {
        return ;
    }
    floating_text.setAttribute('theme', 'light');
    const isDarkMode = false;
    //持久化
    chrome.storage.local.set({ enableDarkMode: isDarkMode });
}