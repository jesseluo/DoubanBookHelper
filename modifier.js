$(document).ready(function() {
	var bookname = document.title.slice(0, document.title.length - 5);
	var buyinfo_ebook;
	var buyinfo_printed = $("#buyinfo #buyinfo-printed")[0];
	var link_std_node = buyinfo_printed.getElementsByTagName("li")[0].cloneNode(true);
	
	if ($("#buyinfo #buyinfo-ebook").length === 0) 
	{
		buyinfo_ebook = buyinfo_printed.cloneNode(true);
		buyinfo_ebook.id = "buyinfo-ebook";

		buyinfo_printed.getElementsByTagName("h2")[0].firstChild.nodeValue="纸质版";
		buyinfo_ebook.getElementsByTagName("h2")[0].firstChild.nodeValue="电子版";

		// alert(buyinfo_ebook.getElementsByTagName("h2")[0].firstChild.nodeValue);
		
		var web_nodes = buyinfo_ebook.getElementsByTagName("li");
		var web_nodes_len = web_nodes.length;
		for (var i = 0; i < web_nodes_len; i++) {
			web_nodes[0].parentNode.removeChild(web_nodes[0]);	
		};	
		
		buyinfo_printed.parentNode.insertBefore(buyinfo_ebook, buyinfo_printed);
		// $("#buyinfo-printed").before(buyinfo_ebook);		
	}
	else
	{
		$("#buyinfo #buyinfo-ebook .ebook-tag").hide();
		buyinfo_ebook = $("#buyinfo #buyinfo-ebook")[0];
	};

	buyinfo_ebook.getElementsByTagName("ul")[0].appendChild(link_std_node.cloneNode(true));

	// var link_duokan = "http://book.duokan.com/search/"+ bookname + "/1";
	// var link_tangcha = "http://tangcha.tc/books/search/" + bookname;

	// var li_class_str_duokan =  "<li><a target=\"_blank\" href=\""+ link_duokan 
	// 	+ "\" class=\"\">多看</a></li>";
 //    var li_class_str_tangcha =  "<li><a target=\"_blank\" href=\""+ link_tangcha
 //    	+ "\" class=\"\">唐茶</a></li>";      

	// $("#buyinfo ul li:first").before(li_class_str_duokan);
	// $("#buyinfo ul li:first").before(li_class_str_tangcha);
});

function get_buyinfo_ebooks() {
	return;
}
