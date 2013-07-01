function getPriceString (price) {
	return "RMB " + parseFloat(price).toFixed(2).toString();
}

Function.prototype.Apply = function (thisObj) {
    var _method = this;
    return function (data) {
        return _method.apply(thisObj, [data]);
    };
};

function makeItemNodeTemplate (argument) {
	ITEMNODE_TEMPLATE = document.createElement("li");
	var _linkNode = document.createElement("a");
	var _spanNodeName = document.createElement("span");
	var _spanNodePrice = document.createElement("span");
	var _spanNodePriceStr = document.createElement("span");

	_spanNodePriceStr.className = "";
	_spanNodePriceStr.appendChild(document.createTextNode("fetching"));
	_spanNodePrice.className = "buylink-price";
	_spanNodeName.appendChild(document.createTextNode("fetching"));
	_spanNodeName.className = "";
	_linkNode.target = "_blank";
	_linkNode.className = "";
	ITEMNODE_TEMPLATE.className = "";

	_spanNodePrice.appendChild(document.createTextNode("( "));
	_spanNodePrice.appendChild(_spanNodePriceStr);
	_spanNodePrice.appendChild(document.createTextNode(") "));
	_linkNode.appendChild(_spanNodeName);
	_linkNode.appendChild(_spanNodePrice);
	ITEMNODE_TEMPLATE.appendChild(_linkNode);
}

function makeBuyinfoNode() {
	buyinfoOfPrinted = $("#buyinfo #buyinfo-printed")[0];

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
		buyinfoOfEbook.getElementsByTagName("li")[0].id = "buyinfo-douban";
		buyinfoOfEbook.getElementsByTagName("li")[0].getElementsByTagName("span")[0].firstChild.nodeValue="豆瓣";
	}

	var _add2cartContainer = buyinfoOfEbook.getElementsByClassName("add2cartContainer ft")[0];
	if (_add2cartContainer !== undefined) {
		_add2cartContainer.parentNode.removeChild(_add2cartContainer);
	}
}

function ResultOfProcess (link, price) {
	this.link = _link;
	this.price = _price;
}

function appendItemNode (id, name, link, price) {
	var _itemNode = ITEMNODE_TEMPLATE.cloneNode(true);
	_itemNode.id = id;
	_itemNode.getElementsByTagName("a")[0].href = link;
	_itemNode.getElementsByTagName("span")[0].firstChild.nodeValue = name;
	_itemNode.getElementsByTagName("span")[1].getElementsByTagName("span")[0]
		.firstChild.nodeValue = price;
	console.log(_itemNode);

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

function processYuncheng (data, status) {
	var _start, _end;
	var _link, _price;

	if (status === "success") {
		if (data.indexOf("很抱歉，没有找到") == -1) {
			_start = data.indexOf("booklist");
			_start = data.indexOf("href", _start) + 7;
			_end = data.indexOf("rank", _start) - 2;
			_link = data.slice(_start, _end);
			_link = "http://www.yuncheng.com/" + _link;

			_start = data.indexOf("云 城 价") + 6;
			_end = _start + 2;
			_price = data.slice(_start, _end);

			if (_price !== "免费") {
				_start = data.indexOf(">", _start) + 6;
				_end = data.indexOf("<", _start) - 1;
				_price = "RMB " + data.slice(_start, _end);
			}

			appendItemNode("buyinfo-yuncheng", "云中书城", _link, _price);
		}
		else{
			console.log("No found on Yuncheng");
		}
	}
	else {
		console.log("Get Yuncheng failed, status = " + status);
	}
}

function processDuokan (data, status) {
	if (status === "success") {
		if (data.count > 0) {
			appendItemNode("buyinfo-duokan", "多看书城",
				"http://book.duokan.com/" + data.items[0].afs + "/b/" + data.items[0].sid,
				getPriceString(data.items[0].price));
		}
		else {
			console.log("No found on Duokan");
		}
	}
	else {
		console.log("Get Duokan failed, status = " + status);
	}
}

function OnlineBookStore(name, chnName, searchUrlTmpl, functionOfDataProcess) {
	this.name = name;
	this.chnName = chnName;
	this.searchUrlTmpl = searchUrlTmpl;
	this.functionForGet = functionOfDataProcess;
}

(function () {
	makeItemNodeTemplate();
	makeBuyinfoNode();

	var _bookname = document.title.slice(0, document.title.length - 5);
	var _bookstores = [];

	_bookstores[0] = new OnlineBookStore("Duokan", "多看书城", "http://book.duokan.com/store/v0/web/search?s={{=bookname }}", processDuokan);
	_bookstores[1] = new OnlineBookStore("Tangcha", "唐茶字节社", "http://tangcha.tc/books/search/{{=bookname }}", processTangcha);
	_bookstores[2] = new OnlineBookStore("Yuncheng", "云中书城", "http://www.yuncheng.com/search?q={{=bookname }}", processYuncheng);

	for (var i = 0; i < _bookstores.length; i++) {
		_bookstores[i].searchURL = _bookstores[i].searchUrlTmpl.replace("{{=bookname }}", _bookname);
		console.log("Search link: " + _bookstores[i].searchURL);

		$.get(
			_bookstores[i].searchURL,
			_bookstores[i].functionForGet
		);
	}
})();
