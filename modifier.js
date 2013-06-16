function appendItemNode (id, name, link, price) {
	console.log(name);
	console.log(link);
	console.log(price);

	var _itemNode = stdInfoNode.cloneNode(true);
	_itemNode.id = id;
	_itemNode.getElementsByTagName("a")[0].href = link;
	_itemNode.getElementsByTagName("span")[0].firstChild.nodeValue = name;
	_itemNode.getElementsByTagName("span")[1].getElementsByTagName("span")[0]
		.firstChild.nodeValue = price;
	buyinfoOfEbook.getElementsByTagName("ul")[0].appendChild(_itemNode);
}

function processTangcha (data, status) {
	var _start, _end;
	var _link, _price;

	if (status === "success") {
		if (data.indexOf("无法找到相关的书籍") == -1) {
			_start = data.indexOf("book-cell");
			_start = data.indexOf("href", _start) + 7;
			_end = data.indexOf("class", _start) - 2;
			_link = data.slice(_start, _end);
			_link = "http://tangcha.tc/" + _link;

			appendItemNode("buyinfo-tangcha", "唐茶字节社", _link, "fetching");

			$.get(
				_link,
				function(data, status) {
					var _start, _end, _price;

					if (status === "success") {
						_start = data.indexOf("book-purchase");
						_start = data.indexOf(">", _start) + 3;
						_end = data.indexOf("<", _start);
						_price = "RMB " + data.slice(_start, _end);

						document.getElementById("buyinfo-tangcha")
							.getElementsByTagName("span")[1]
							.getElementsByTagName("span")[0]
							.firstChild.nodeValue = _price;
					}
					else {
						console.log("Get Tangcha failed, status = " + status);
						var _buyinfoTangcha = document.getElementById("buyinfo-tangcha");
						_buyinfoTangcha.parentNode.removeChild(_buyinfoTangcha);
					}
				}
			);
		}
		else{
			console.log("No found on Tangcha");
		}
	}
	else {
		console.log("Get Tangcha failed, status = " + status);
	}
}

function processDuokan (data, status) {
	var _start, _end;
	var _link, _price;

	if (status === "success") {
		if (data.indexOf("很抱歉，没有找到") == -1) {
			_start = data.indexOf("<div class=\"info\">");
			_start = data.indexOf("href", _start) + 7;
			_end = data.indexOf("hidefocus", _start) - 2;
			_link = data.slice(_start, _end);
			_link = "http://book.duokan.com/" + _link;

			_start = data.indexOf("price\">") + 15;
			_end = data.indexOf("<", _start);
			_price = "RMB " + data.slice(_start, _end);

			appendItemNode("buyinfo-duokan", "多看书城", _link, _price);
		}
		else{
			console.log("No found on Duokan");
		}
	}
	else {
		console.log("Get Duokan failed, status = " + status);
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
	_bookstores[1] = new OnlineBookStore("Tangcha", "http://tangcha.tc/books/search/{{=bookname }}", processTangcha);
	// _bookstores[2] = new OnlineBookStore("Yuncheng", "http://www.yuncheng.com/search?q={{=bookname }}", processYuncheng);

	for (var i = 0; i < _bookstores.length; i++) {
		_searchURL = _bookstores[i].searchUrlTmpl.replace("{{=bookname }}", _bookname);
		$.get(
			_searchURL,
			_bookstores[i].funcToProcess
		);
	}

	buyinfoOfPrinted = $("#buyinfo #buyinfo-printed")[0];
	stdInfoNode = buyinfoOfPrinted.getElementsByTagName("li")[0].cloneNode(true);

	if ($("#buyinfo #buyinfo-ebook").length === 0)
	{
		buyinfoOfEbook = buyinfoOfPrinted.cloneNode(true);
		buyinfoOfEbook.id = "buyinfo-ebook";
		buyinfoOfEbook.getElementsByTagName("h2")[0].firstChild.nodeValue="电子版";
		buyinfoOfPrinted.getElementsByTagName("h2")[0].firstChild.nodeValue="纸质版";

		var _buyinfoItemNodes = buyinfoOfEbook.getElementsByTagName("li");
		var _numOfBuyinfoItemNodes = _buyinfoItemNodes.length;
		for (i = 0; i < _numOfBuyinfoItemNodes; i++) {
			_buyinfoItemNodes[0].parentNode.removeChild(_buyinfoItemNodes[0]);
		}
		buyinfoOfPrinted.parentNode.insertBefore(buyinfoOfEbook, buyinfoOfPrinted);
	}
	else
	{
		$("#buyinfo #buyinfo-ebook .ebook-tag").hide();
		buyinfoOfEbook = $("#buyinfo #buyinfo-ebook")[0];
		buyinfoOfEbook.getElementsByTagName("li")[0].getElementsByTagName("span")[0].firstChild.nodeValue="豆瓣";
	}
});
