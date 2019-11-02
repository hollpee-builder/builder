<?php  
function getFileName()
{
	$fileNameArray = array();
	$url = $_SERVER['REQUEST_URI'];
	// 2 сфлеша
	$url = preg_replace('|[/]{2,}|', '/', $url);
	// убираем параметры
	for ($i=0;$i<3;$i++) $url = preg_replace('/\?[^\?]*$/', '', $url);
	//получаем основу 
	$main = preg_replace('|^'.$_SERVER['DOCUMENT_ROOT'].'|', '', $_SERVER['SCRIPT_FILENAME']);
	$main = preg_replace('|/hlp_index.php$|', '', $main);
	// убираем основу
	$fileName = preg_replace('|^'.$main.'|', '', $url);
	$fileName = preg_replace('@(^/)|(/$)@', '', $fileName);
	// если нет, то index
	if (!$fileName) $fileName = "index.php";
		
	return $fileName;
}

function getSiteFolder()
{
	// $folder = preg_replace('/\?[^\?]*$/', '', $_SERVER['REQUEST_URI']);
	// $folder = preg_replace('/\/*[^\/]+$/', '', $folder);
	// $folder = preg_replace('/^\//', '', $folder);

	$folder = preg_replace('/\/*[^\/]+$/', '', $_SERVER['SCRIPT_NAME']);
	$folder = preg_replace('/^\//', '', $folder);

	return $folder;
}

function getAbtestFilePath($pageId, $folder = false)
{
	$rootFolder = 'data/abtest';
	if ($folder) $rootFolder = $folder . '/' . $rootFolder;
	if (!file_exists($rootFolder)) mkdir($rootFolder);

	$path = $rootFolder.'/abtest_'.$pageId.'.txt';
	return $path;
}

function getDymTitleFilePath($pageId, $folder = false)
{
	$rootFolder = 'data/dymtitle';
	if ($folder) $rootFolder = $folder . '/' . $rootFolder;
	if (!file_exists($rootFolder)) mkdir($rootFolder);

	$path = $rootFolder.'/dymtitle_'.$pageId.'.txt';
	return $path;
}

function getCmsIndex()
{
	$cmsIndexPath = 'admin/data/cms_index.txt';
	if (!file_exists($cmsIndexPath)) return false;
	
	$cmsIndex = file_get_contents($cmsIndexPath);

	return trim($cmsIndex);
}

function setConstPath()
{
	$root = getSiteFolder();
	$adminFolder = $root ? $root.'/admin' : 'admin';

	define('HLP_ADMIN_FOLDER', $adminFolder);
	define('HLP_SITE_FOLDER', $root);
	define('HLP_ADMIN_FOLDER_PATH', $_SERVER['DOCUMENT_ROOT'] . '/' . HLP_ADMIN_FOLDER . '/');
	define('HLP_SITE_FOLDER_PATH', $_SERVER['DOCUMENT_ROOT'] . '/' . HLP_SITE_FOLDER . '/');
}

?>