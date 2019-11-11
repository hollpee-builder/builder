/**
* Создание картинки
*
* @parent 	EditElementBasic
*/
EditElementEmbed.prototype = EditElementBasic;
var EditElementEmbed = new EditElementEmbed();
EditElementEmbed.parent = EditElementBasic;

function EditElementEmbed() {
	/**
	*
	*
	*
	*/
	this.edit = function(params)
	{
		this.params = params;

		var modalTitle = this.params.operation == "add" ? Resource.hlp_modal_iframe_title_add 
																: Resource.hlp_modal_iframe_title_edit;
		var oldIframeCode = '';
		if (this.params.operation == "edit") {
			oldIframeCode = Element.obj.find("> .element-content").html();
		}

		var obj = this;
		EditorCode.edit(modalTitle, oldIframeCode, function(iframeCode) {
			if (obj.params.operation == "add") {
				ElementEmbed.create({"iframe":iframeCode});
			} else {
				Element.obj.find("> .element-content").html(iframeCode);
				Modal.delete();
			}
		});

	}

} // end class
