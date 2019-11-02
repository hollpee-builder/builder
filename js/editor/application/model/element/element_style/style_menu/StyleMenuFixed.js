/**
* Фиксированые
*
*
*
*/
var StyleMenuFixed = new StyleMenuFixed();
function StyleMenuFixed() {
	/**
	* Ставит значение
	*
	* @see 	StyleMenu.set()
	*/	
	this.set = function(elm) {
		// заголовок
		this.setTitleRightMenu()
		// дополнительный класс
		this.setClassAdded(elm);
		// состояние
		this.setState(elm);
		// тип элемента
		this.setBasicElmType(elm);
	}
	
	/**
	* Установить название в правой панели
	*
	* @see 	 	ElementStyleController.noteElement()  	при выборе нового элемента
	* @see 		EditorController.setEventNavMenu() 		навигация правого блока
	*/
	this.setTitleRightMenu = function()
	{
		var elm = Element.obj;
		// имя элемента, если его нет берем его тип
		var name = Element.data.type;
		
		//список значений
		var list = Element.data.title;

		// уникальное для элемента
		var uniqName = elm.attr("data-property-title-name");
		if (uniqName) var elmTitleName = uniqName;
		else var elmTitleName = list['name'];

		var uniqImg = elm.attr("data-property-title-img");
		if (uniqImg) var elmTitleImg = uniqImg;
		else var elmTitleImg = list['img'];

		//ставим текст
		$('.rightMenuTypeElm').html(elmTitleName).attr("data-elm-type", Element.data.type);
		//ставим картинку
		$('.rightMenuTypeElm').css('background-image', 'url(/img/editor/elements/'+elmTitleImg+')');
		
		//ставим кнопку
		if (list['type'] != 'none' ) {
			//имя кнопки
			$('.rightMenuTopButtonText').text(list['but_text']);
			//тип кнопки
			$('.rightMenuTopButton').attr('type', list['type']);
			
			//показываем кнопку 
			$('.rightMenuTopButton').css('display', 'block');
		} else {
			$('.rightMenuTopButton').css('display', 'none');
		}

		// убираем кнопки state, если не вкладка стили
		var isTabStyle = $(".rightMenuNavItem[type='style'][chosen='true']").length;
		if (!isTabStyle) $(".blockTypeState").css("display", "none");
	}

	/**
	* Ставим дополнительный класс
	*
	* @see 	this.set()
	* @see 	this.updateEditorClass()
	*/
	this.setClassAdded = function(elm)
	{
		var classAdded = Element.getClassAdded(elm);

		// если есть класс
		if (classAdded) {
			var addedDisplay = "block";
			var addedStatus = "true";
			var butAddDisplay = "none";
			var butDeleteDisplay = "block";
		} else {
			var addedDisplay = "none";
			var addedStatus = "false";
			var butAddDisplay = Element.data.no_added_class ? "none" : "block";
			var butDeleteDisplay = "none";
		}

		if (Element.data.no_added_class) {
			var butDeleteDisplay = "none";
		}

		// unique
		var classUnique = Element.getClassUnique();
		classUnique = /[^\.]+$/gim.exec(classUnique);
		var butClassUnique = $(".menuClassUnique");
		butClassUnique.text(classUnique[0]);

		// для added
		$(".menuClassAdded").text(classAdded)
							.css("display", addedDisplay);

		// статус для размера блоков
		$(".menuFixedItemClass").attr("added", addedStatus);
		
		// для кнопок
		$(".menuClassButAdd").css("display", butAddDisplay);
		$(".menuClassButDelete").css("display", butDeleteDisplay);

		
		var elm = Element.obj;
		if (elm.attr("class-unique")
				&& elm.attr("data-property-no-edit-class") != "true"
				&& !Element.data.no_edit_class) {
			var butClassUniqueTitle = Resource.hlp_modal_class_edit;
			butClassUnique.removeAttr("no-edit");
		} else {
			var butClassUniqueTitle = Resource.hlp_modal_class_no_edit;
			butClassUnique.attr("no-edit", "true");
		}
		butClassUnique.attr("label", butClassUniqueTitle);
	}

	/**
	* Ставит состояние
	*
	*
	*/
	this.setState = function(elm)
	{
		var panelObj = $(".selectElmState");
		var tabTypeV = $(".rightMenuNavItem[chosen='true']").attr("type");

		if (tabTypeV != "style" && tabTypeV != "site") {
			panelObj.addClass("displayNone");
			panelObj.removeAttr("style");
			return false;
		} else {
			panelObj.removeClass("displayNone");
		}

		var listOption = $(".selectElmState .option"); 
		listOption.filter("[value='focus']").css("display", "none");

		if (Element.data.is_state_chosen) {
			listOption.filter("[value='chosen']").css("display", "block");
		}

		if (elm.hasClass("input") || elm.hasClass("textarea")) {
			listOption.filter("[value='focus']").css("display", "block");
		}	
	}

/***************************************************************************************/
	
	/**
	* Тип элемента
	*
	*
	*/
	this.setBasicElmType = function(elm)
	{
		if (elm.hasClass("site")) {
			ElementBasicType.setSiteSelectDefault()
		} else if (ElementBasicType.isElmBasicType(elm)) {
			var value = ElementBasicType.getCurrentType();
			ElementBasicType.setVisibleBlockMenu(elm, value);
		}
	}

	/**
	* Установка 
	*
	*
	*/
	this.editBasicElmType = function(elm, value)
	{
		if (value == "all") var newElm = $(".content .site");
		else var newElm = ElementBasicType.getObjByType(value);

		Element.setData(newElm);
		Select.set($(".selectElmState"), "static");

		StyleMenu.set();
		// показываем или убираем в блоки меню 
		ElementBasicType.setVisibleBlockMenu(elm, value);
	}

/*********************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит события
	*
	* @see 	StyleMenu.setEvent()
	*/	
	this.setEvent = function()
	{
		// добавление
		this.setEventAddClass();
		// удаление
		this.setEventDeleteClass();
		// изменение
		this.setEventEditClass();
	}

	this.setStyleEditClass = function()
	{
		StyleMenu.set();
		ElementSetting.set();
		ElementWidget.set();
	}

	/**
	* Добавление 
 	*
	* @see 	this.setEvent()
	*/
	this.setEventAddClass = function()
	{
		var elmBlock = $(".menuListClassBlock");
		var elmInput = $(".valuleMenuClassAdded");
		var obj = this;
		
		$(".menuClassButAdd").off("mousedown");
		$(".menuClassButAdd").on("mousedown", function() {
			
			// показываем input
			elmBlock.css("display", "none");
			elmInput.css("display", "block").val("").focus();
			
			// ставим событие
			elmInput.off("change focusout");
			elmInput.on("change focusout", function(event) {

				// добавляем класс
				var newClassAdded = elmInput.val().trim();
				newClassAdded = Element.clearClass(newClassAdded);
				var newClassAddedClearing = newClassAdded.replace(/[0-9\-]+$/gim, '');

				if (!newClassAdded || newClassAdded == 'NaN') {
					obj.closePanelClassAdded();
					elmInput.off("change focusout");
					return false;
				} else if (ElementBasic.isInterdictedClass(newClassAdded)) {
					newClassAdded = Element.getNewClassUnique(newClassAddedClearing);
				}

				var isExists = false;
				if (newClassAdded) {
					isExists = $("."+newClassAdded).not("[class-added='"+newClassAdded+"']").length;
				}

				// если такой класс есть такой класс уникальный
				if (isExists) {
					newClassAdded = Element.getNewClassUnique(newClassAddedClearing);
				}

				// атрибуты анимации
				var originElmV = $("."+newClassAdded);
				Element.addStdAddedClass(originElmV, Element.obj);

				// закрываем панель
				obj.closePanelClassAdded();

				// обновляем стили
				obj.setStyleEditClass();
				
				// ставим класс 
				Element.addClassAdded(newClassAdded);
				// ставим значение в редакторе
				obj.updateEditorClass();

				elmInput.off("change focusout");

				// ставим стили в панели
				obj.afterManipulationClass();

				History.record();

				return false;
			});

			return false;
		});
	}

	/**
	* Закрытие панели с дополнительным классом
	*
	* @see 	this.setEventAddClass()
	* @see 	Editor.resetFocus()
	*/
	this.closePanelClassAdded = function()
	{
		$(".menuListClassBlock").css("display", "block");
		$(".valuleMenuClassAdded").css("display", "none");
	}

	/**
	* Обновляет хначение в редакторе
	*
	* @see 	this.setEventAdd()
	*/
	this.updateEditorClass = function()
	{
		// ставим значение в меню
		this.setClassAdded();	
		// строим вложеность
		PageStruct.build();
		PageStruct.buildNested();
	}
/*********************************************************************************************/

	/**
	* Удаление 
 	*
	* @see 	this.setEvent()
	*/
	this.setEventDeleteClass = function()
	{
		var obj = this;
		$(".menuClassButDelete").off("mousedown");
		$(".menuClassButDelete").on("mousedown", function() {
			// удаляем класс
			Element.removeClassAdded();
			// ставим значение в редакторе
			obj.updateEditorClass();
			// ставим значение в меню
			// обновляем стили
			obj.setStyleEditClass();

			// фиксируем историю
			History.record();

			// ставим стили в панели
			obj.afterManipulationClass();
		});
	}

/*******************************************************************************************/
	
	/**
	* Изменение
	*
	*
	*/
	this.setEventEditClass = function()
	{
		var obj = this;
		var listClassObj = $(".menuFixedClass");
		$(".menuFixedClass").off("dblclick");
		$(".menuFixedClass").on("dblclick", function() {
			var classBlockObj = $(this);

			if (classBlockObj.attr("no-edit")) return false;

			var oldClass = classBlockObj.text();
			var content = obj.getContentEditClass(oldClass);
			
			Modal.create({"id":"modalEditClass", "content":content, "width":400, "top":100});
			SpecialInput.setEventOnlyEng($("#modalEditClass .valueNewClass"));
			
			obj.editClass(classBlockObj, oldClass);
			return false;
		});
	}

	/**
	* Отдает содержимое для модального - изменить класс
	*
	*
	* @see 	this.setEventEditClass()
	*/
	this.getContentEditClass = function(oldClass)
	{
		var content = '\
					<div class="labelEditClass">\
						'+Resource.hlp_modal_class_edit_label+'\
					</div>\
					<input type="text" class="valueNewClass" value="'+oldClass+'" only-eng="true"/>\
					<div class="editClassAllClassWrap">\
						<input type="checkbox" checked class="valueEditClassAllClass" />\
						<div class="editClassAllClassLabel">'+Resource.hlp_modal_class_edit_all_class+'</div>\
						<div class="clear"></div>\
					</div>\
					<div class="listButEditClass">\
						<div class="butBlock butCancel">'+Resource.main_modal_but_cancel+'</div>\
						<div class="butOk butEditClass">'+Resource.main_modal_but_edit+'</div>\
						<div class="clear"></div>\
					</div>';

		return content;
	}

	/**
	* Изменить класс
	*
	* @see 	this.setEventEditClass();
	*/
	this.editClass = function(classBlockObj, oldClass)
	{
		var obj = this;

		$(".butEditClass").off("mousedown");
		$(".butEditClass").on("mousedown", function() {
			var typeClass = classBlockObj.attr("type");
			var newClass = $("#modalEditClass .valueNewClass").val();
			if (!newClass) return false;
			var isAllElmEdit = $("#modalEditClass .valueEditClassAllClass").prop("checked");
			Modal.delete();

			var elm = Element.obj;
			newClass = Element.clearClass(newClass);
			newClassNoNumber = newClass.replace(/[0-9\-]+$/gim, '');

			// нельзя его добавлять
			if (!ElementBasic.isAddThisClass(newClass)) {
				newClass = Element.getNewClassUnique(newClassNoNumber);
			} 

			// unique, а класс есть как added
			var isExistsAddedClass = $(".element[class-added='"+newClass+"'").length;
			if (isExistsAddedClass && typeClass == "unique") {
				newClass = Element.getNewClassUnique(newClassNoNumber);
			}

			// added, а класс есть как unique
			var isExistsUniqueClass = $(".element[class-unique='"+newClass+"'").length;
			if (isExistsUniqueClass && typeClass != "unique") {
				newClass = Element.getNewClassAdded(elm, newClassNoNumber);
			}

			// если разные типы элементов, то нельзя
			var newObjV = $("."+newClass);
			if (newObjV.length && elm.attr("elm-type") != newObjV.attr("elm-type")) {
				// только для уникального
				if (typeClass == "unique") {
					newClass = Element.getNewClassUnique(newClassNoNumber);
				} else {
					// newClass = Element.getNewClassAdded(elm, newClassNoNumber);
				}
			}

			
			// добавляем классу префикс
			newClass = Element.addClassPrefix(newClass);

			if (oldClass != newClass) {
				var elmEditObj = false;
				// если не выбран что, не все, то изменяем только у текущего элемента 
				if (!isAllElmEdit) {
					elmEditObj = Element.obj;
				}

				// атрибуты анимации
				var originElmV = $("."+newClass);
				Element.addStdAddedClass(originElmV, elm);

				// изменяем в стиля класс
				ElementCss.editClass(typeClass, oldClass, newClass, elmEditObj);
				// ставим на кнопки новый класс
				classBlockObj.text(newClass);

				

				// удаляем класс
				elm.addClass(oldClass);
				ElementCss.deleteClass(oldClass, elm);
				elm.removeClass(oldClass);

				// обновляем стили
				obj.setStyleEditClass();
			}

			obj.afterManipulationClass();

			History.record();

			return false;
		});
	}

	/**
	* Отдает список стандартных классов
	*
	* @see 	this.editClass()
	*/
	this.getListStandartClass = function(newClass)
	{
		var elmType = Element.data.type;
		var listStandartClass = $("."+newClass)
								.not("[class-unique='"+newClass+"'][elm-type='"+elmType+"']")
								.not("[class-added='"+newClass+"'][elm-type='"+elmType+"']")

		return listStandartClass;
	}


	/**
	* Манипуляция после изменения
	*
	* @see 	this.setEventAddClass()
	* @see 	this.setEventDeleteClass()
	* @see 	this.editClass()
	*/
	this.afterManipulationClass = function()
	{
		// с отяжкой
		setTimeout(function() {
			// строим вложеность
			PageStruct.build();
			PageStruct.buildNested();
			// ставим стили
			StyleMenu.set();
		}, 500);
	}

/************************************************************************************************/
}//end class

