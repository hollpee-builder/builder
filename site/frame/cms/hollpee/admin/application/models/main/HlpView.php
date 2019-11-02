<?php 
/**
* Класс формирует данные для вывода пользователю
*
*/
class HlpView {
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
		
		if (!$root_path)  $root_path = $_SERVER['DOCUMENT_ROOT'].'/'.HLP_ADMIN_FOLDER;
		// формируем обсалютный путь до папки с html
		$file_url = $root_path.'/'.$url;
		// формируем обсалютный путь до подключаемого файла
		$file = $file_url.'/'.$nameFile;
		
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
			require_once $file;
		} else {
			return null;
		}
		// выводим результат
		return ob_get_clean();
	}
}// end class


?>




















