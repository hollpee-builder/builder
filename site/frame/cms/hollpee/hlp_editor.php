<?php
$pageId = $_GET['hlp-page-id'];
HlpData::setPageId($pageId);

$file_path = $pageId . '.php';
$content = hlp_get_file_content($file_path);
$content = preg_replace_callback('/((?:[^\w\-]))(script)/', function($res) {
	return $res[1].'hlp_hlp_scr_hlp_hlp';
}, $content);
$content .= get_editor_file($pageId);

echo $content;

function hlp_get_file_content($file_path, $params=array())
{
	if (is_array($params)) {
		foreach ($params as $key => $value) $$key = $value;
	}

	ob_start();
	if (file_exists($file_path)) require_once $file_path;
	else return null;
	return ob_get_clean();
}

function get_editor_file($pageId)
{
	setConstPath();

	$siteId = preg_replace('/_[0-9]+$/', '', $pageId);

	require_once 'admin/application/models/main/HlpUrl.php';
	require_once 'admin/application/models/main/HlpFile.php';
	require_once 'admin/application/models/HlpDataXML.php';

	$content = '';
	$content .= hlp_get_file_content('admin/application/views/editor_head_file.php');
	$content .= hlp_get_file_content('admin/application/views/editor.php');
	/*****/
	$objDataXML = new HlpDataXML();
	$listCustomizerPage = $objDataXML->getCustomizer($pageId);
	$listCustomizerPage = $listCustomizerPage ? json_encode($listCustomizerPage, true) : '';
	$content .= '<div class="h-list-customizer h-list-customizer-page">' . $listCustomizerPage . '</div>';

	$listCustomizerMain = $objDataXML->getCustomizer($siteId.'_main');
	$listCustomizerMain = $listCustomizerMain ? json_encode($listCustomizerMain, true) : '';
	$content .= '<div class="h-list-customizer h-list-customizer-main">' . $listCustomizerMain . '</div>';

	// имя файла
	$content .= '<div class="h-site-id">' . $siteId . '</div>';
	$content .= '<div class="h-page-id">' . $pageId . '</div>';
	// список картинок
	$listImg = json_encode(HlpFile::getListFile("images", '/'.$siteId), true);
	$content .= '<div class="h-folder-file" data-hlp-type="images">' . $listImg . '</div>';
	// список файлов
	$listFile = json_encode(HlpFile::getListFile("files"), true);
	$content .= '<div class="h-folder-file" data-hlp-type="files">' . $listFile . '</div>';
	
	/****/

	return $content;
}

?>
