chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.executeScript(null, { file: 'content.js' });
	chrome.tabs.insertCSS(null, { file: 'content.css' });
});
