<?php 
function getArr($arr)
{
	echo '<pre>';
	print_r($arr);
	echo '</pre>';
	exit;
}
/***************************************************************************************************/
/**************************************************************************************************/

header('Content-Type: text/html; charset=utf-8');
session_start();//запускаем сессию

//ставим название папки админ панели  
$hlp_url_folder = preg_replace('/(^\/)|(\/?[^\/]+$)/', '', $_SERVER['SCRIPT_NAME']);

$HLP_ADMIN_FOLDER = $hlp_url_folder;
$HLP_SITE_FOLDER = preg_replace('/\/?[\w]+$/', '', $hlp_url_folder);
define('HLP_ADMIN_FOLDER', $HLP_ADMIN_FOLDER);
define('HLP_SITE_FOLDER', $HLP_SITE_FOLDER);
define('HLP_ADMIN_FOLDER_PATH', $_SERVER['DOCUMENT_ROOT'] . '/' . HLP_ADMIN_FOLDER . '/');
define('HLP_SITE_FOLDER_PATH', $_SERVER['DOCUMENT_ROOT'] . '/' . HLP_SITE_FOLDER . '/');

$hlp_cms_index_file = HLP_ADMIN_FOLDER_PATH.'/data/cms_index.txt';
if (file_exists($hlp_cms_index_file)) {
	$HLP_CMS_INDEX = file_get_contents($hlp_cms_index_file);
	$HLP_CMS_INDEX = trim($HLP_CMS_INDEX);
	define('HLP_CMS_INDEX', $HLP_CMS_INDEX);
}

/*********************************************************************************/

// записываем фаил js
$configJsPath = HLP_ADMIN_FOLDER_PATH  . '/js/main/config.js';
file_put_contents($configJsPath, 'var ADMIN_FOLDER = "' . HLP_ADMIN_FOLDER . '";');

// подключаем константы
require_once HLP_ADMIN_FOLDER_PATH . '/application/const.php';

/********************************************************************************/

ob_start();

//подключение файла
function __autoload($class)
{
	$list_folder = array(
						'/controllers',
						'/controllers/main',
						'/models',
						'/models/main',
						'/models/db',
						'/views',
						'/models/integration',
						'/models/integration/list',
						'/models/integration/list/payment',
					);
	
	$pathApp = $_SERVER['DOCUMENT_ROOT'] . '/' . HLP_ADMIN_FOLDER . '/application';

	foreach ($list_folder as $folder) {
		//путь файла
		$pathFile = $pathApp.'/'.$folder.'/'.$class.'.php';

		//подключаем фаил
		if (file_exists($pathFile)) {
			require_once $pathFile;
			break;
		}
	}		
}

/********************************************************************************/

// создаем объект
$front = HlpFrontController::getInstance();
// разбираем url и запускаем класс с методом
$front->route();
// выводим результат
echo $front->getBody();
echo trim(ob_get_clean());
