chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.msg == "getCurrentTabInfo") {
			sendResponse(JSON.parse(localStorage.getItem("_activeTabInfo")));
		} else if(request.msg == "setActiveTabInfo") {
			sendResponse("ActiveTab information was updated.")
			chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
				localStorage.setItem("_activeTabInfo", JSON.stringify(tabs[0]));
			});
		}
	}
);