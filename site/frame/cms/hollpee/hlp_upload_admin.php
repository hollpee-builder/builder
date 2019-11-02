<?php
$listFolderUpload = array(
	'hlp_index.php',
	'hlp_editor.php',
	'hlp_title.php',
	'hlp_sts.php',
	'hlp_download.php',
	'php',
	'.htaccess',

	'css/hlp_main.css',
	'js/hlp_script.js',
	'js/jquery.js',

	// policy
	'hlp_personal_information.php',
	'hlp_privacy_policy.php',
);

$listFolderAdminUpload = array(
	'application',
	'css',
	'img',
	'js',
	'index.php'
);

function upload_admin_copy($listFile, $folderFrom = '', $folderTo = '')
{
	foreach ($listFile as $file) {
		$filePathFrom = $folderFrom.$file;
		$filePathTo = $folderTo.$file;

		if (!file_exists($filePathFrom)) continue; 

		if (file_exists($filePathTo)) HlpDir::remove($filePathTo);
		HlpDir::copy($filePathFrom, $filePathTo);
	}
}

// обновление папки widget
function upload_folder_widget($folderUploadPath)
{
	$widgetFolder = $folderUploadPath . '/widget';
	$dir = opendir($widgetFolder);
	while ($file = readdir($dir)){
		if ($file == '.' || $file == '..') continue;

		$widgetNew = 'widget/' . $file;
		if (file_exists($widgetNew)) HlpDir::remove($widgetNew);
		HlpDir::copy($widgetFolder.'/'.$file, $widgetNew);
	}
	closedir($dir);
}

function upload_folder_store($folderFrom = '', $folderTo = '')
{
	$folderStore = '/data/store/';
	$produtcFrom = $folderFrom.$folderStore;
	$produtcTo = $folderTo.$folderStore;

	if (!file_exists($produtcTo)) mkdir($produtcTo);

	$dir = opendir($produtcFrom);
	while ($file = readdir($dir)){
		if ($file == '.' || $file == '..') continue;

		$orgPath = $produtcFrom . '/' . $file;
		$newPath = $produtcTo . '/' . $file;

		if (file_exists($newPath)) unlink($newPath);
		HlpDir::copy($orgPath, $newPath);
	}
	closedir($dir);
}

// обновление bd
function update_db($adminFolder)
{
	$folderDbPath = $adminFolder.'/application/models/db';
	require_once $folderDbPath.'/HlpDb.php';
	require_once $folderDbPath.'/HlpDbUpdate.php';

	HlpDbUpdate::getInstance($adminFolder)->execute($adminFolder);
}

/***********************************************************************************/
/***********************************************************************************/

ob_start();
/********************************/
$adminFolder = 'admin';
$modelsPath = $adminFolder.'/application/models';
require_once $modelsPath.'/HlpSite.php';
require_once $modelsPath.'/main/HlpDir.php';
/*******************************************/

$objSite = new HlpSite();
$uploadFolder = $objSite->getFolderUploadAdmin();
$folderUploadPath = $uploadFolder . '/';
$adminUploadPath = $folderUploadPath.'admin/';

// копируем
upload_admin_copy($listFolderUpload, $folderUploadPath);
upload_admin_copy($listFolderAdminUpload, $adminUploadPath, $adminFolder.'/');
// копируем файлы
HlpDir::copy($uploadFolder.'/hlp_files', '');

// для виджета
upload_folder_widget($folderUploadPath);
// store
upload_folder_store($adminUploadPath, 'admin/');
// для db
update_db($adminFolder);

HlpDir::remove($folderUploadPath);
/*************/

header('Location: ' . $adminFolder);
$result = ob_get_clean();
echo trim($result);

?>
