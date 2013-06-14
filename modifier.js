function getBody(content) {
   var x = content.indexOf("<body");
   x = content.indexOf(">", x);
   var y = content.lastIndexOf("</body>");
   return content.slice(x + 1, y);
}

function processDuokan (data, status) {
	var _start, _end;
	var _link, _price;
	console.log(data);

	if (status === "success") {
		if (data.indexOf("很抱歉，没有找到") == -1) {
			// var webContent = document.createElement("div");
			// webContent.innerHTML = getBody(data);
			// console.log(typeof webContent);
			// console.log(webContent);
			// var bookInfo = webContent.childNodes[0].getElementById("searchlist").getElementsByTagName("div")[1];
			// console.log(bookInfo);

			_start = data.indexOf("<div class=\"info\">");
			_start = data.indexOf("href", _start) + 7;
			_end = data.indexOf("hidefocus", _start) - 2;
			_link = data.slice(_start, _end);
			_link = "http://book.duokan.com/" + _link;

			_start = data.indexOf("price\">") + 15;
			_end = data.indexOf("<", _start);
			_price = data.slice(_start, _end);
		}

		console.log(_link);
		console.log(_price);
	}
	else {
		console.log(status);
	}
}

function OnlineBookStore(storeName, searchUrlTmpl, funcToProcess) {
	this.storeName = storeName;
	this.searchUrlTmpl = searchUrlTmpl;
	this.funcToProcess = funcToProcess;
	this.linkToBook = null;
	this.priceOfBook = null;
}

$(document).ready(function() {
	var _bookname = document.title.slice(0, document.title.length - 5);

	var _bookstores = [];
	_bookstores[0] = new OnlineBookStore("Duokan", "http://book.duokan.com/search/{{=bookname }}/1", processDuokan);

	for (var i = 0; i < _bookstores.length; i++) {
		console.log(i);
		_searchURL = _bookstores[i].searchUrlTmpl.replace("{{=bookname }}", _bookname);
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

