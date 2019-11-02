<?php 
/**
* Класс формирует данные для вывода пользователю
*
* Данный класс получает определеные данные, затем формирует 
* выходные данные. Класс является базовым. Классы потомки имеют
* определеную специализацию один формирует категории товара,
* а другой уже сам товар и т. д.
*
* @package view
* @author Даутов Рустем
* @copyright 2012-2013 CMS TRADE
*/
class View {
	/**
	* Загружает фаил
	* Загружает полученный фаил и вставляет туда полученые переменные
	* и все это ввыдает в одной переменной
	*
	* @return string Возращяет сформированый текст из файла и переменных
	* @uses используется в потомках класса IController
	*/
	static function render($nameFile, $params=array(), $root_path='', $url='/application/views/')
	{
		global $list_root;
		
		if (!$root_path)  $root_path = $_SERVER['DOCUMENT_ROOT'];
		// формируем обсалютный путь до папки с html
		$file_url = $root_path.$url;
		// формируем обсалютный путь до подключаемого файла
		$file = $file_url.$nameFile;
		
		
		// формируем переменные из полученного масива
		if (is_array($params)) {
			foreach ($params as $key => $value) {
				$$key = $value;
			}	
		}
		
		// ставим эту функцию, что бы не выводилось а складывалось
		ob_start();
		// подключаем фаил
		if (file_exists($file)) {
			require $file;
		} else {
			return null;
		}
		// выводим результат
		return ob_get_clean();
	}

	/**
	* Склеиваем части в страницу
	*
	*/
	function gluePart($array, $url='/application/views/')
	{
		$root = $_SERVER['DOCUMENT_ROOT'].$url;
		ob_start();
		if (is_array($array)) {
			foreach ($array as $part) {
				$file = $root.$part;
				if (file_exists($file)) {
					require $file;
				}
			} 
		}
		return ob_get_clean();
	}


	/**
	* Узнаем содержиться ли элемент в массиве
	* Если такой элемент в массиве есть то выводи его а если нет
	* то выводи элемен с указаным ключом $n
	*
	* @param array $array Содержиться массив вкотором надо искать
	* @param string|integer $item То что надо искать
	* @param integer $n если не найдено элемента, то выводиться элемент с этим ключом
	* @return bool Если нашел то true если нет то false
	*/
	public function this_contains($array, $item, $n=0)
	{
		// количество элементов 
		$cnt = count($array);
		$sum = 0;
		foreach ($array as $v) {
			if ($v != $item) {
				$sum++;
			}
		}
		
		if ($sum == $cnt) {
			return $array[$n];
		} else {
			return $item;
		}
	}

	




}

	


?>




















