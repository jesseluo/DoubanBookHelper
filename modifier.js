$(document).ready(function() {
	var _bookname = document.title.slice(0, document.title.length - 5);
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
		for (var i = 0; i < _numOfBuyinfoItemNodes; i++) {
			_buyinfoItemNodes[0].parentNode.removeChild(_buyinfoItemNodes[0]);	
		};	
		
		_buyinfoOfPrinted.parentNode.insertBefore(_buyinfoOfEbook, _buyinfoOfPrinted);
		// $("#buyinfo-printed").before(_buyinfoOfEbook);		
	}
	else
	{
		$("#buyinfo #buyinfo-ebook .ebook-tag").hide();
		_buyinfoOfEbook = $("#buyinfo #buyinfo-ebook")[0];
	};

	_buyinfoOfEbook.getElementsByTagName("ul")[0].appendChild(_stdInfoNode.cloneNode(true));

	// var link_duokan = "http://book.duokan.com/search/"+ bookname + "/1";
	// var link_tangcha = "http://tangcha.tc/books/search/" + bookname;

	// var li_class_str_duokan =  "<li><a target=\"_blank\" href=\""+ link_duokan 
	// 	+ "\" class=\"\">多看</a></li>";
 //    var li_class_str_tangcha =  "<li><a target=\"_blank\" href=\""+ link_tangcha
 //    	+ "\" class=\"\">唐茶</a></li>";      

	// $("#buyinfo ul li:first").before(li_class_str_duokan);
	// $("#buyinfo ul li:first").before(li_class_str_tangcha);
});

