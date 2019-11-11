/**
* Работа с элементом img
*
*
*/
var ElementText = new ElementText();
function ElementText() {
	this.oldText = '';

	/**
	* Изменение текста
	*
	* @see 	this.setEventEdit()
	*/
	this.editText = function(elmEvent)
	{
		this.createModal(elmEvent);
		this.setEventModal(elmEvent);
	}

	this.createModal = function(elmEvent)
	{
		var content = this.getContentModal(elmEvent);
		Modal.create({
			"id":"modalTextEdit",
			"title":"Изменение текста",
			"content":content,
			"width":500,
			"height":200,
			"button":[
				["cancel", "Отмена"],
				["ok", "Сохранить"],
			]
		});

		// добавляем блок для сброски значений
		Element.addClearCustomizer($("#modalTextEdit"));
	}

	this.getContentModal = function(elm)
	{
		elm = this.getElm(elm);

		var text = elm.html();
		var content = '\
			<div class="modal-block-item">\
				<div class="modal-block-label">Текст</div>\
				<textarea class="valueText">'+text+'</textarea>\
			</div>';

		var isLink = elm.prop("tagName") == "A";
		if (isLink) {
			var link = elm.attr("href");

			if (this.isLinkDown(elm)) {
				var linkTitle = 'Файл для скачивания (должен быть в папке files)';
				link = this.getFileFromLink(link);
			} else {
				var linkTitle = 'Ссылка';
			}

			content += '\
			<div class="modal-block-item">\
				<div class="modal-block-label">'+linkTitle+'</div>\
				<input class="valueLink" value="'+link+'" />\
			</div>';
		}	

		return content;
	}

	this.setEventModal = function(elm)
	{
		var obj = this;
		var butObj = $("#modalTextEdit .hollpee-but-ok");
		butObj.off("click");
		butObj.on("click", function() {
			var text = $("#modalTextEdit .valueText").val();
			obj.editTextSelf(text);

			var inputLink = $("#modalTextEdit .valueLink");
			if (inputLink.length) obj.editLink(inputLink.val());
			
			Modal.delete();
			Site.setStatusSave(false);
		});
	}

	this.editTextSelf = function(text)
	{
		var elm = this.getElm();

		text = text.replace(/<div>/gim, '<br>');
		text = text.replace(/<\/div>/gim, '');
		text = text.replace(/<br>$/gim, '');
		text = text.replace(/\t+/gim, '');
		text = text.trim();

		elm.html(text);
		Element.editCustomizer(Element.obj, text, "text");
	}

	this.editLink = function(link)
	{
		var elm = this.getElm();

		link = link.trim();
		// если ссылка
		if (this.isLinkDown(elm)) {
			link = this.getLinkDownFromFile(link);
		}

		elm.attr("href", link);
		Element.editCustomizer(Element.obj, link, "link");
	}

/*************************************************************************************/

	this.getElm = function(elm)
	{
		if (!elm) elm = Element.obj;

		// если ссылка
		var linkNoClass = elm.find(">a:not([class])");
		if (linkNoClass.length && elm.find(">*").length == 1) {
			elm = linkNoClass;
		}

		return elm;
	}

	this.isLinkDown = function(elm)
	{
		return elm.attr("data-hlp-action");
	}

	this.getFileFromLink = function(link)
	{
		return link.replace(/^files\/hlp_download\.php\?file=/gim, '');
	}

	this.getLinkDownFromFile = function(file)
	{
		return "files/hlp_download.php?file="+file;
	}

/*************************************************************************************/

}// end class

