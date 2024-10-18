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

document.addEventListener('DOMContentLoaded', function() {
    console.log(document);
    // document.querySelector('.dark-mode-shift').addEventListener('click', () => {
    //     if (document.querySelector('.floating-text').getAttribute('theme') === 'light') {
    //         setThemeDark();
    //     }
    //     else {
    //         document.querySelector('.floating-text').setAttribute('theme', 'light');
    //     }
    // });
});