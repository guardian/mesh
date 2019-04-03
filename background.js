chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.executeScript(null, { file: 'load.js' });
	chrome.tabs.insertCSS(null, { file: 'content.css' });
});
