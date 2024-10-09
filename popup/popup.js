

document.addEventListener('DOMContentLoaded', function() {
    //获取当前页面的dark-mode状态
    chrome.storage.local.get('enableDarkMode', function(result) {
        const isDarkMode = result.enableDarkMode;
        if (isDarkMode) {
            document.getElementById('setting-profile-black').setAttribute('checked', true);
        }
        else
        {
            document.getElementById('setting-profile-black').removeAttribute('checked');
            document.getElementById('setting-profile-light').setAttribute('checked', true);
        }
    });

    document.getElementById('setting-profile-black').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: setProfileDark
            });
        });
        //将其checked属性加入
        this.setAttribute('checked', true);
    });
});

function setProfileDark() {
    const floating_table = document.querySelector('.floating-table');
    //如果已经是dark-mode，不变
    if (floating_table.classList.contains('dark-mode')) {
        return;
    }
    const isDarkMode = floating_table.classList.toggle('dark-mode');
    //持久化
    chrome.storage.local.set({ enableDarkMode: isDarkMode });
}