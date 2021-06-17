<?php
ob_start();

//подключаем константы
include_once $_SERVER['DOCUMENT_ROOT'].'/application/cons.php';


header('Content-Type: text/html; charset=utf-8');

//запускаем сессию
session_start();

/********************************************************************************/
$LANGUAGES = 'ru';
$FILE_NAME = preg_match(	"/^\/editor/", $_SERVER['REQUEST_URI']) ? 'editor' : 'admin';
$FILE_NAME .= '_' . $LANGUAGES;

$FILE_LANGUAGES_DIR = '/languages/' . $LANGUAGES;
$FILE_LANGUAGES_PATH = $FILE_LANGUAGES_DIR . '/' . $FILE_NAME;
$FILE_LANGUAGES_PATH_PHP = $_SERVER['DOCUMENT_ROOT'] . $FILE_LANGUAGES_PATH . '.php';
if (!file_exists($FILE_LANGUAGES_PATH_PHP)) {
	$FILE_LANGUAGES_PATH = '/languages/eng/' . $FILE_NAME;
	$FILE_LANGUAGES_PATH_PHP = $_SERVER['DOCUMENT_ROOT'] . $FILE_LANGUAGES_PATH . '.php';
}
require_once $FILE_LANGUAGES_PATH_PHP;
define("FILE_LANGUAGES_MAIN", $FILE_LANGUAGES_DIR . '/main_' . $LANGUAGES . '.js');
define("FILE_LANGUAGES_JS", $FILE_LANGUAGES_PATH . '.js');
/*********************************************************************************/

//список папок
$list_path = array(
						'/application/controllers/',
						'/application/models/',
						'/application/views/',
						'/application/models/main/',
						'/application/models/db/',
						'/application/models/formatPage/',
					);

//подключение файла
function autoload_register($class)
{
	global $list_path;

	foreach ($list_path as $v) {
		//путь файла
		$pathFile = $_SERVER['DOCUMENT_ROOT'].$v.$class.'.php';

		//подключаем фаил
		if (file_exists($pathFile)) {
			require_once $pathFile;
			//ставим статус для окончания циклов
			$status_break = 1;
			break;
		}
	}
}

spl_autoload_register('autoload_register');

// создаем объект
$front = FrontController::getInstance();
// разбираем url и запускаем класс с методом
$front->route();
// выводим результат
echo $front->getBody();
$result = ob_get_clean();
echo trim($result);
