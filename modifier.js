function processDuokan (data, status) {
	// if (_httpReq.readyState==4)
	// {
	// 	if (_httpReq.status==200)
	// 	{
	// 		console.log(_httpReq.responseText);
	// 		this.webContent = _httpReq.responseText;
	// 	}
	// }
	// else
	// {
	// 	console.log("Problem retrieving data");
	// }
	// return([data, status]);
	if (status === "success") {
		console.log(typeof data);
	}
	else {
		console.log(status);
	}
}

function OnlineBookStore(storeName, searchUrlTmpl, funcToProcess) {
	this.storeName = storeName;
	this.searchUrlTmpl = searchUrlTmpl;
	this.funcToProcess = funcToProcess;
}

$(document).ready(function() {
	var _bookname = document.title.slice(0, document.title.length - 5);

	var _bookstores = [];
	_bookstores[0] = new OnlineBookStore("Duokan", "http://book.duokan.com/search/{{=bookname }}/1", processDuokan);

	for (var i = 0; i < _bookstores.length; i++) {
		console.log(i);
		_searchURL = _bookstores[i].searchUrlTmpl.replace("{{=bookname }}", _bookname);
		// _httpReq.onreadystatechange = _bookstores[i].funcToProcess;
		// _httpReq.open("GET", _searchURL, true);
		// _httpReq.send(null);
		$.get(
			_searchURL,
			_bookstores[i].funcToProcess
		);

		// document.write(_bookstores[i].webContent + "<br>");
	}

	var _buyinfoOfEbook;
	var _buyinfoOfPrinted = $("#buyinfo #buyinfo-printed")[0];
	var _stdInfoNode = _buyinfoOfPrinted.getElementsByTagName("li")[0].cloneNode(true);

	if ($("#buyinfo #buyinfo-ebook").length === 0)
	{
		_buyinfoOfEbook = _buyinfoOfPrinted.cloneNode(true);
		_buyinfoOfEbook.id = "buyinfo-ebook";

		_buyinfoOfPrinted.getElementsByTagName("h2")[0].firstChild.nodeValue="纸质版";
		_buyinfoOfEbook.getElementsByTagName("h2")[0].firstChild.nodeValue="电子版";

		// alert(_buyinfoOfEbook.getElementsByTagName("h2")[0].firstChild.nodeValue);

		var _buyinfoItemNodes = _buyinfoOfEbook.getElementsByTagName("li");
		var _numOfBuyinfoItemNodes = _buyinfoItemNodes.length;
		for (i = 0; i < _numOfBuyinfoItemNodes; i++) {
			_buyinfoItemNodes[0].parentNode.removeChild(_buyinfoItemNodes[0]);
		}

		_buyinfoOfPrinted.parentNode.insertBefore(_buyinfoOfEbook, _buyinfoOfPrinted);
		// $("#buyinfo-printed").before(_buyinfoOfEbook);		
	}
	else
	{
		$("#buyinfo #buyinfo-ebook .ebook-tag").hide();
		_buyinfoOfEbook = $("#buyinfo #buyinfo-ebook")[0];
	}

	_buyinfoOfEbook.getElementsByTagName("ul")[0].appendChild(_stdInfoNode.cloneNode(true));
});

