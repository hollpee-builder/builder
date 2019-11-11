var ElementSettingGrid = new ElementSettingGrid();

function ElementSettingGrid() {

	this.listType = {
		"desktop" : "dsk",
		"tab-l" : "tl",
		"tab-p" : "tp", 
		"mobile-l" : "ml", 
		"mobile-p" : "mp"
	};

	this.attr = {};
	this.attr.count_row = "count-row";

	this.maxCountRow = 6;

/**************************************************************************************/
	/**
	*
	*
	* @see 	ElementBasicType.getReplaceSectionRow()
	*/		
	this.getAttrCountRow = function()
	{
		return this.attr.count_row;
	}

/**************************************************************************************/

	/**
	* Установка значений
	*
	* @see 	this.editCountRow()
	* @see 	this.editDesctopCount()
	* @see 	this.resetColumnSize()
	*/
	this.set = function()
	{
		$(".menuSettingGrid").find(".menuSettingButValue, .menuButValue").removeAttr("chosen");
		var elmRow = Element.obj.closest(".row");

		//отступ 
		this.setMargin(elmRow);
		//количество рядов
		this.setCountRow(elmRow); 

		// данные
		var listColumn = elmRow.find("> .column");//список колонок 
		var allCount = listColumn.length;// количество колонок
		var countInRow = parseInt(elmRow.attr("count-column"));

		// для декстопа
		this.setForDesctop(listColumn, countInRow);
		// не для десктопа
		this.setForNoDesctop(elmRow, allCount, countInRow);
		
		// удаление колонки 
		this.setEventDeleteColumn();
	}
/**********************************************************************************************/
	/**
	* Ставит отступ
	*
	* @see 	this.set()
	*/
	this.setMargin = function(elmRow)
	{
		if (elmRow.hasClass("hlp-row-col-no-indent")) var margin = "no";
		else var margin = "yes";

		$(".menuGridMargin .menuButValue[value='"+margin+"']").attr("chosen", "true");
	}

	/**
	* Количество колонок
	*
	* @see 	this.set()
	*/
	this.setCountRow = function(elmRow)
	{
		var countColumn = elmRow.attr("count-row");
		$(".menuGridCountRow .menuButValue[value='"+countColumn+"']").attr("chosen", "true");
	}
/**********************************************************************************************/
	/**
	* Установка для декстопа
	*
	* @see 	this.set()
	*/
	this.setForDesctop = function(listColumn, countInRow)
	{
		// отмечаем текущий
		$(".menuCountColumns .menuSettingOptionColumn[value='"+countInRow+"']")
								.attr("chosen", "true");
		
		// размер
		this.setDesctopSize(listColumn, countInRow);
	}

	/**
	* Устанавливает размер для desctop
	*
	* @see 	this.setForDesctop()
	* @see 	this.editDesctopCount()
	*/ 
	this.setDesctopSize = function(listElmColumn, countInRow)
	{
		var menuSize = $(".menuColumnsSize");
		// если больше 1 строки или 5 колонок, убираем
		var countRow = listElmColumn.parent().attr("count-row");
		if (countInRow == "5") {
			menuSize.css("display", "none");
			return false 
		}

		menuSize.css("display", "block");

		var blockSeparators = $(".columnsSiziBlockSeparators");
		blockSeparators.html('');
		var blockSizingColumn = $(".listSizingColumn");
		blockSizingColumn.html('');
		var totalWeight = 0;

		var elmRowObj = Element.obj.closest(".row");
		var countColumn = elmRowObj.attr("count-column");

		for (var i = 0; i < countColumn; i++) {
			var elmColumn = listElmColumn.eq(i);
			if (!elmColumn.length) continue;

			var elmItemClassV = elmColumn.attr("class");
			elmItemClassV = elmItemClassV.replace(/col\-w\-[0-9]+-((dsk)|([tmlp]+))/gim, '');
			var weight = elmItemClassV.match(/col\-w\-[0-9]+/gim);

			// если стоит
			if (weight) {
				var weightColumn = weight[0].replace(/[^0-9]+/gi, '');
			} else { // ставим по умолчанию
				var weightColumn = 12 / countInRow;
			}
				
			// колонка в меню
			var sizingColumn = '<div class="itemSizingColumn" value="'+weightColumn+'"><span>'+weightColumn+'</span></div>';
			blockSizingColumn.append(sizingColumn);

			// разделитель
			totalWeight += parseInt(weightColumn);
			if (totalWeight < 12) {
				var sizingSeparator = '<div class="columnsSiziSeparator" value="'+totalWeight+'"><span></span></div>';
				blockSeparators.append(sizingSeparator);
			}
		}

		// ставим события
		this.setEventEditSizeColumn();
	}
/*****************************************************************************************/
	/**
	* Установить не для десктопа
	* 
	* @see 	this.set()
	* @see 	this.editDesctopCount()
	*/	
	this.setForNoDesctop = function(elmRow, allCount, countInRow)
	{
		// ставим для кнопки больше 3 (планшет, мобильный)
		$(".menuBetterThreeColumn").attr("value", countInRow);
		// прячим некоторый кнопки
		$(".menuOptionColumnHide").css("display", "none");
		// убираем выделение
		$(".menuGridTabH, .menuGridTabV, .menuGridMobileH, .menuGridMobileV").find(".menuSettingOptionColumn").removeAttr("chosen");

		// для планшета
		this.setTab(elmRow, allCount, countInRow);
		// для телефона
		this.setMobile(elmRow, allCount, countInRow);
	}

	/**
	* Установка для планшета
	*
	* @see this.setForNoDesctop()
	*/
	this.setTab = function(elmRow, allCount, countInRow)
	{
		var countL = this.getCountInRow(elmRow, "tl", countInRow);
		var countP = this.getCountInRow(elmRow, "tp", countInRow);

		var parentClassL = "menuGridTabH";
		var parentClassP = "menuGridTabV";

		// показываем кнопки колонок
		this.showButColumns(parentClassL, allCount, countInRow);
		this.setValue(parentClassL, countL);// устанавливаем значение

		// показываем кнопки колонок
		this.showButColumns(parentClassP, allCount, countInRow);
		this.setValue(parentClassP, countP);// устанавливаем значение
	}

	/**
	* Для мобильного
	*
	* @see this.setForNoDesctop()
	*/
	this.setMobile = function(elmRow, allCount, countInRow)
	{
		// только колонка первой вложености имеет ширину 100%
		var elmParenObj = elmRow.parent()
		var defaultCount =  elmParenObj.hasClass("section-content") || elmParenObj.hasClass("modal") ? 
															1 : countInRow;
		// var defaultCount = 1;
		var hCount = this.getCountInRow(elmRow, "ml", defaultCount);
		var vCount = this.getCountInRow(elmRow, "mp", defaultCount);

		// мобильный вертикальный
		var parentClassMV = "menuGridMobileV";
		this.showButColumns(parentClassMV, allCount, countInRow);//показываем доступные кнопки
		this.setValue(parentClassMV, vCount);//отмечаем кнопку
			
		// мобильный горизонтальный
		var parentClassMH = "menuGridMobileH";
		this.showButColumns(parentClassMH, allCount, countInRow);
		this.setValue(parentClassMH, hCount);

		// прячем кнопки больше 3 для мобильного, если надо
		this.hideButForMobile(elmRow);
	}


	/**
	* Прячем кнопки для мобильного
	* @see this.setMobile()
	*/
	this.hideButForMobile = function(parentElm, countInRow)
	{
		// если это колонки первой вложености то прячем кнопку больше 3
		var butBetterThree = $(".menuGridMobileV .menuBetterThreeColumn, .menuGridMobileH .menuBetterThreeColumn");
		var isParentSection = parentElm.parent().hasClass("section-content");
		if (isParentSection) var status = "none";
		else var status = "block";
		// butBetterThree.css("display", status);
		butBetterThree.css("display", "block");
	}


	/**
	* Отдает количество колонок в строке по классу родителя
	*
	* @see 	this.setMobile(), this.setTab()
	*/
	this.getCountInRow = function(parentElm, partClass, defaultCount)
	{
		var parentClass = parentElm.attr("class");

		var pattern = new RegExp("hlp-row-col-([0-9]+)-"+partClass, "gi");
		var count = pattern.exec(parentClass);
		if (count)	count = count[1]; 
		else count = defaultCount;

		return count;
	}

/*********************************************************************************/
	/**
	* Устанавливает значение не для декстопа
	*
	* @see 	this.setTab()
	* @see 	this.setMobile()
	*/
	this.setValue = function(parentSettingBut, countColumnInRow)
	{
		$("."+parentSettingBut+" .menuSettingOptionColumn")
										.filter("[value='"+countColumnInRow+"']")
										.attr("chosen", "true");
	}

	/**
	* Показываем кнопки колонок
	*
	* @see 	this.setTab()
	* @see 	this.setMobile()
	*/
	this.showButColumns = function(parentClass, allCount, countInRow)
	{	
		countInRow = parseInt(countInRow);
		var listButValue = [2,3,4];
		var countBut = listButValue.length;
		
		// показываем кнопкку если кнопка меньше значения
		for (var i = 0; i < countBut; i++) {
			var butValue = parseInt(listButValue[i]);
			if (butValue < countInRow) {
				this.showOneButColumn(parentClass, allCount, butValue);
			}
		}
	}

	/**
	* Показать одну кнопку 
	* @see this.showButColumns()
	*/
	this.showOneButColumn = function(parentClass, countColumn, count)
	{
		var isThree = false;
		if (countColumn != count) {
			isThree = countColumn % count ? false : true;// три колонки
		}

		// if (isThree) {
			$("."+parentClass+" .menuSettingOptionColumn[value='"+count+"']")
										.css("display", "block");
		// }
	}

/********************************************************************************/
		
	/**
	* Удаление колонки
	*
	* @see 	this.set()
	*/
	this.setEventDeleteColumn = function()
	{
		var blockDeleteObj = $(".menuColumnDelete"); 
		if (!Element.obj.hasClass("column")) {
		// if (true) {
			blockDeleteObj.css("display", "none");
			return false;
		} else {
			blockDeleteObj.css("display", "block");
		}

		var obj = this;
		var butObj = $(".butDeleteColumn");
		butObj.off("mousedown");
		butObj.on("mousedown", function() {
			var elm = Element.obj;
			var parentObj = elm.closest(".row");

			var countColumnV = parentObj.find("> .column").length;
			if (countColumnV == 1) {
				Notification.error("Должна остаться минимум 1 колонка");
				return false;
			}

			elm.remove();
			History.record();
			
			parentObj.mousedown().mouseup();
			
			// убираем отступ у некоторых колонок
			obj.setColumnNoIndent();
			PageStruct.build();
		});
	}


/************************************************************************************************/
/*********************************************************************************************/
	/**
	* Ставит отступ
	*/
	this.editMargin = function(elm, value)
	{
		// var listRow = Element.get(elm.closest(".row"));
		var listRow = Element.getAllObject(elm.closest(".row"), true);
		
		// ставим, 2 по умолчанию
		if (value == "no") listRow.addClass("hlp-row-col-no-indent");
		else listRow.removeClass("hlp-row-col-no-indent");
	}

/**********************************************************************************************/
	/**
	* Количество рядов
	*
	*
	*/
	this.editCountRow = function(elm, newCount)
	{
		var elmRow = elm.closest(".row");
		var oldCount = elmRow.attr("count-row");
		var allCountColumn = elmRow.find(">.column").length;
		var countInRow = elmRow.attr("count-column");//allCountColumn / oldCount;
		// var countInRow = $(".menuCountColumnsValue .menuSettingOptionColumn[chosen='true']").val();
		// var diffrentColumn = (newCount - oldCount) * countInRow;
		var diffrentColumn = newCount * countInRow - allCountColumn;
		diffrentColumn = Math.ceil(diffrentColumn);

		// изменяем количество колонок
		this.editRowColumn(elmRow, diffrentColumn, newCount);
		elmRow.attr("count-row", newCount);

		// ставим колонки, что бы все сбросилось
		// this.editDesctopCount(elm, elmRow.attr("count-column"));
		// ставим значения
		this.set();
		// сброс значений
		this.resetColumnNoIndent();
		this.setClassAdded();

		// ставим id
		Element.addNewId(elmRow);

		Input.newCanvas();
		Resize.addBlock();

		// если убирается
		elmRow.find("> .column:first").mousedown().mouseup();
	}


	/**
	* Установить количество колонок
	*
	* @see 	this.editCountRow()
	*/
	this.editRowColumn = function(elmRow, countColumn, newCountCol)
	{
		var countInRow = elmRow.attr("count-column");
		var listColumn = elmRow.find("> .column");
		var currentColCount = listColumn.length;
		
		
		//больше
		if (countColumn > 0) {
			var finishColCount = newCountCol * countInRow;
			// добавляем
			for (var i = currentColCount; i < finishColCount; i++) {
				var curNumberRow = parseInt(i / countInRow);
				var indexCol = i - (curNumberRow * countInRow);
				// console.log(indexCol)

				// блок
				var column = listColumn.eq(indexCol);
				var columnClass = column.attr("class").replace(/elementSelected/gim, '');

				var columnClassUnique = '';
				if (column.attr("class-unique")) columnClassUnique = ' class-unique="'+column.attr("class-unique")+'"'; 


				var columnClassAdded = '';
				if (column.attr("class-added")) columnClassAdded = ' class-added="'+column.attr("class-added")+'"';

				columnClass = columnClass.replace(/undefined/gim, '');

				var rowBlock = '<div class="'+columnClass+'"'+columnClassUnique+columnClassAdded+' elm-type="column"></div>';

				// elmRow.append(rowBlock);
				elmRow.find("> .column:last").after(rowBlock);
			}
		} else { // меньше
			// удяляем
			var allCountColumn = listColumn.length;
			for (var i = allCountColumn + countColumn; i < allCountColumn; i++) {
				listColumn.eq(i).remove();
			}
		}
	}
/**********************************************************************************************/
	/**
	* Количество колонок у декстопа
	*
	* @see 	event
	* @see 	this.editCountRow()
	*/
	this.editDesctopCount = function(elm, newCount)
	{
		var elmParentObj = Element.obj.closest(".row"); 
		newCount = parseInt(newCount);
		var listRowObjV = Element.getAllObject(elm.closest(".row"), true);
		var countRow = listRowObjV.length;

		for (var iRow = 0; iRow < countRow; iRow++) {
			this.editDesctopCountAction(listRowObjV.eq(iRow), newCount);
		}

		// добавляем класс по умолчанию для tp
		// if (elmParentObj.parent().hasClass("section-content")) {
		// 	if (newCount == 2) {
		// 		elmParentObj.addClass("hlp-row-col-1-tp");
		// 	} else if (newCount == 3 || newCount == 4) {
		// 		elmParentObj.addClass("hlp-row-col-2-tp");
		// 	} else if (newCount == 6) {
		// 		elmParentObj.addClass("hlp-row-col-3-tp");
		// 		elmParentObj.addClass("hlp-row-col-2-ml");
		// 	}
		// }

		// строим структуру
		PageStruct.build();
		// 
		// Resize.create();

		this.setColumnNoIndent();
		this.set();
		elmParentObj.find("> .column:first").mousedown().mouseup();
	}

	this.editDesctopCountAction = function(elmRow, newCount)
	{
		// ставим количество колонок у элемента
		this.setCountColumnElement(elmRow, newCount);

		// ставим id
		Element.addNewId(elmRow);
		
		// сброс значений
		this.resetColumnNoIndent();
		this.setClassAdded();
	}

	/**
	* Ставим количество колонок у элемента
	*
	* @see this.editDesctopCount()
	*/
	this.setCountColumnElement = function(elmRow, newCount)
	{
		var listColumn = elmRow.find("> .column");
		var currentValue = elmRow.attr("count-column");
		var countInRow = elmRow.attr("count-column");
		var countRow = elmRow.attr("count-row");

		// нужно меньше
		if (currentValue > newCount) {
			var fromN = newCount * countRow;
			var toN = listColumn.length;
			//убираем
			for (var i = fromN; i < 200; i++) {
				var elmCol = listColumn.eq(i);
				if (!elmCol.length) break;
				if (!elmCol.find(".element").length) {
					elmCol.remove();
				} 
			}

			// если убран elementSelected
			if (!elmRow.find(".elementSelected").length) {
				// эмитируем клик по последнему элементу
				// Element.obj.closest(".row").find("> .column:first-child").mousedown();
			}

			// пересчитываем кол рядов
			var newCountRowV = elmRow.find("> .column").length / newCount;
			if (newCountRowV > parseInt(newCountRowV)) {
				newCountRowV = parseInt(newCountRowV) + 1;
			}
			if (newCountRowV > this.maxCountRow) newCountRowV = this.maxCountRow;
			elmRow.attr("count-row", newCountRowV);
			this.setCountRow(elmRow);
		// нужно больше
		} else {
			// var count = newCount - currentValue;
			// count *= countRow; 
			var count = newCount * countRow;
			count -= listColumn.length; 

			for (var i = 0; i < count; i++) {
				var uniqueClass = listColumn.attr("class-unique");
				var newBlockColumn = '\
					<div class="element column hlp-col" elm-type="column">\
					</div>';
				// elmRow.append(newBlockColumn); // вставляем
				elmRow.find("> .column:last").after(newBlockColumn);
			}
			// ставим события для новых элементов
			Input.newCanvas();
		}

		// очищаем все параметры
		this.clearAllProperty(elmRow);
		// ставим классы
		this.setClassCount(elmRow, newCount);
	}

	/**
	* Ставит класс - количество колонок
	*
	*
	* @see 	this.setCountColumnElement()
	*/
	this.setClassCount = function(elmRow, newCount)
	{
		// ставим количество колонок
		elmRow.attr("count-column", newCount);
		elmRow.addClass("hlp-row-col-"+newCount);
		// elmRow.addClass("tab-l-count-"+newCount);
		// elmRow.addClass("tab-p-count-"+newCount);
	}

	/**
	* Очищает вес колонки
	*
	* @see 	this.setCountColumnElement()
	*/
	this.clearAllProperty = function(elmRow)
	{
		if (!elmRow.hasClass("row")) {
			elmRow = Element.obj.closest("row");
		}

		// очищаем количество в колонки
		var rowClass = elmRow.attr("class");
		var clearingClass = rowClass.replace(/hlp-row-col-[0-9][a-z\-]*/gim, '')
									.replace(/[\s]+/gim, " ");

		elmRow.attr("class", clearingClass);

		// очищаем вес 
		var listColumn = elmRow.find(">.column");
		var classElm = listColumn.attr("class");
		classElm = classElm.replace(/elementSelected/gim);
		var clearingClass = classElm.replace(/\shlp-col-w-[0-9]+[a-z\-]*/gim, '');
		clearingClass = clearingClass.replace(/\shlp-col-w-[0-9]+-((dsk)|([tmlp]+))/gim, '');

		clearingClass = clearingClass.replace(/\s?undefined/gim, '');

		listColumn.attr("class", clearingClass);

		Element.obj.addClass("elementSelected");
	}
/****************************************************************************************/
	/**
	* Изменение размера колонок
	*
	* @see 	this.setDesctopSize()
	*/
	this.setEventEditSizeColumn = function()
	{
		var obj = this;
		var listSeparators = $(".columnsSiziSeparator");
		var blockSeparators = $(".columnsSiziBlockSeparators");

		listSeparators.off("mousedown");
		listSeparators.on("mousedown", function(e) {
			blockSeparators.attr("move", "true"); 
			var elmEvent = $(this);
			var indexElm = parseInt(elmEvent.index(".columnsSiziSeparator"));
			var oldX = e.pageX; // старый 
			var step = $(".columnsSiziBlockSeparators").width()/12;
			var left = parseInt(elmEvent.css("left"));
			var currentLeft = 0; 
			var newValue = 0; //новое значение - количество шагов
			var minStep = indexElm > 0 ? 
					parseInt(listSeparators.eq(indexElm - 1).attr("value")) + 1 : 1;
			var maxStep = listSeparators.eq(indexElm + 1).length ?
					listSeparators.eq(indexElm + 1).attr("value") - 1 : 11;
			//для обновления информации 
			var startLength = minStep - 1;
			var endEnd = maxStep + 1;
			var listSizingColumn = $(".itemSizingColumn");
			var oneSection = listSizingColumn.eq(indexElm);
			var twoSection = listSizingColumn.eq(indexElm + 1);
			var rowElm = Element.getAllObject(Element.obj.closest(".row"), true);
			// var rowElm = Element.obj.closest(".row");
			var oneElm = rowElm.find(">.column").eq(indexElm);
			var twoElm = rowElm.find(">.column").eq(indexElm + 1);
			var valueOne = 0;
			var valueTwo = 0;
			var classOneElm = '';
			var classTwoElm = '';
			var countColumnInRow = rowElm.attr("count-column");

			// передвижение
			$("body").on("mousemove", function(event){
				currentLeft = left + event.pageX - oldX;
				// новое значение
				newValue = Math.round(currentLeft / step);
				// выход за края
				if (newValue < minStep) newValue = minStep;
				if (newValue > maxStep) newValue = maxStep;
				
				// ставим значение
				elmEvent.attr("value", newValue);
				// обновляем информацию
				var valueSection = newValue - startLength;
				if  (valueOne != valueSection) {
					valueOne = valueSection;
					valueTwo = endEnd - newValue;
					// значение в меню
					oneSection.attr("value", valueOne)
								.find("span").text(valueOne);
					twoSection.attr("value", valueTwo)
								.find("span").text(valueTwo);
		
					// значение убираем класс weigh
					classOneElm = oneElm.attr("class").replace(/\shlp-col-w-[0-9]+/, '');
					classTwoElm = twoElm.attr("class").replace(/\shlp-col-w-[0-9]+/, '');
					// ставим класс
					classOneElm += " hlp-col-w-"+valueOne;
					classTwoElm += " hlp-col-w-"+valueTwo;
					
					for (var i = 0; i < rowElm.length; i++) {
						var listColumn = rowElm.eq(i).find(">.column");

						var newIndexElm = indexElm + 1;
						var newIndexElmNext = newIndexElm + 1;
						listColumn.filter(":nth-child("+countColumnInRow+"n+"+newIndexElm+")").attr("class", classOneElm);
						listColumn.filter(":nth-child("+countColumnInRow+"n+"+newIndexElmNext+")").attr("class", classTwoElm);
					}
				}

				return false;
			})
		});

		// сбрасываем событие передвижение
		$("body").off("mouseup");
		$("body").on("mouseup", function() {
			$("body").off("mousemove");
			blockSeparators.removeAttr("move");

			// ставим станддартное количество колонок
			obj.setDefaultSizeColumn();
		});
	}


	/**
	* Устанавливает стандартный размер колонок
	*
	* @see 	this.setEventEditSizeColumn()
 	*/
 	this.setDefaultSizeColumn = function()
 	{
 		var elmRowV = Element.obj.closest(".row");
 		var listAllCol = elmRowV.find("> .column");
 		var listDefaultValue = [ ["6"], ["4"], ["3"], ["2"] ];

 		for (var iPropDefault in listDefaultValue) {
 			var defaultSize = listDefaultValue[iPropDefault][0];
 			
 			var listCol = listAllCol.filter(".hlp-col-w-"+defaultSize);
 			var listColAllEditing = listAllCol.filter("[class*='hlp-col-w-']");
 			if (listCol.length == listColAllEditing.length) {
 				listAllCol.removeClass("hlp-col-w-"+defaultSize);
 			}
 		}
 	}

/*****************************************************************************************/

	/**
	* Изменение количество колонок для не
	* tab_h 		tab-l
	* tab_v 		tab-p
	* mobile_h		mobile-l
	* mobile_v 		mobile-p
	*/
	this.editNoDesctop = function(elm, value, elmEvent)
	{
		// var elmRow = Element.get(elm.closest(".row"));
		var elmRow = Element.getAllObject(elm.closest(".row"), true);
		var typeScreen = elmEvent.parent().attr("type"); //тип устройства

		
		var type = this.listType[typeScreen];

		var count = elmEvent.attr("value");

		// очищает
		this.clearClassRow(elmRow, type); 
		

		var isScreenMobileV = typeScreen == "mobile-l" || typeScreen == "mobile-p";
		var isParentSectionV = elmRow.parent().hasClass("section-content");

		// if (isScreenMobileV) { /*мобильный один экран*/
		// 	if (isParentSectionV) {
		// 		if (count == 1) return false;
		// 	}
		// } else 
		if (elmEvent.hasClass("menuBetterThreeColumn")) {/*для планшета*/
			this.setColumnNoIndent();
			return false;
		}

		// ставим класс строке
		var newClassMain = "hlp-row-col-"+count;
		var newClass = newClassMain + "-"+type;
		elmRow.addClass(newClass.trim());

		// убираем отступ у некоторых колонок
		this.setColumnNoIndent();
	}

	/**
	* Очищает класс строки
	*
	* @see 	this.editNoDesctop()
	*/
	this.clearClassRow = function(elmRow, partClass)
	{
		var currentClass = elmRow.attr("class"); //класс
		// var pattern = new RegExp(partClass+"-count-"+"[0-9]+", "gi");//шаблон(добавляем часть класса стандартного)
		var pattern = new RegExp("hlp-row-col-[0-9]+-"+partClass, "gi");
		var clearingClass = currentClass.replace(pattern, '');
		
		elmRow.attr("class", clearingClass.trim());
	}

/****************************************************************************************************/
/****************************************************************************************************/
	/**
	* Убираем margin у некоторых колонок
	*
	* @see 	this.editNoDesctop()
	* @see 	this.setEventDeleteColumn()
	* @see 	this.resetColumnSize()
	* @see 	ElementManController.setEventModeSimpleMove()
	* @see 	PageStruct.moveElm() 	
	*/
	this.setColumnNoIndent = function(elm)
	{
		if (!elm) elm = Element.obj;

		this.resetColumnNoIndent();
		this.setClassAdded();

		var listScreen = {"desktop":"", "tl":"", "tp":"", "ml":"", "mp":""};
		var elmRow = elm.closest(".row");
		var listColumn = elmRow.find("> .column");
		var countColumn = listColumn.length;

		var rowClass = elmRow.attr("class");
		var listColumnCount = {};
		for (var screenValue in listScreen) {
			var partPat = screenValue == "desktop" ? "" : "-" + screenValue;

			var patternRowCount = new RegExp("hlp-row-col-([0-9]+)"+partPat, "gim");
			var rowClassCountCol = patternRowCount.exec(rowClass);
			
			if (rowClassCountCol) {
				rowClassCountCol = rowClassCountCol[1];
			} else if (screenValue == "tl" || screenValue == "tp") {
				rowClassCountCol = listColumnCount["desktop"];
			} else {
				rowClassCountCol = 1;
			}
			listColumnCount[screenValue] = rowClassCountCol;


			var countNoIndent = countColumn % parseInt(rowClassCountCol);
			// console.log(screenValue+' -> '+countNoIndent)

			if (countNoIndent) {
				var classNoIndent = 'hlp-col-no-indent' + partPat;
				for (var iColumn = 0; iColumn < countNoIndent; iColumn++) {
					var columnIndex = countColumn - iColumn - 1;
					listColumn.eq(columnIndex).addClass(classNoIndent);
				}
			}

		}
	}

	/**
	* Сброс значений
	*
	* @see 	this.editCountRow()
	* @see 	this.editDesctopCount()
	*/
	this.resetColumnNoIndent = function()
	{
		var listColumn = Element.obj.closest(".row").find("> .column");

		listColumn.removeClass("hlp-col-no-indent")
					.removeClass("hlp-col-no-indent-tl")
					.removeClass("hlp-col-no-indent-tp")
					.removeClass("hlp-col-no-indent-ml")
					.removeClass("hlp-col-no-indent-mp");
		
	}

	/**
	* Проставляет дополнительные класыы
	*
	* @see 	
	*/
	this.setClassAdded = function()
	{	
		var elmRowObj = Element.obj.closest(".row");
		var listColumn = elmRowObj.find("> .column");
		var countColumn = listColumn.length;
		for (var iCol = 0; iCol < countColumn; iCol++) {
			var colObj = listColumn.eq(iCol);
			var classAddedV = colObj.attr("class-added");
			if (classAddedV && classAddedV != undefined) {
				colObj.addClass(classAddedV);
			}
		}
	}


	/**
	* Сбрасывает размер колонок
	*
	* @see 	ElementCss.afterClearStyleGeometry() 
	*/
	this.resetColumnSize = function(elm)
	{
		elm.find("> .column").attr("class", "element hlp-col column");
		this.setColumnNoIndent();
		this.set();
	}


}//end class
