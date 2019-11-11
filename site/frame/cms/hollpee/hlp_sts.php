<?php  

$hash_str = $_GET['hlp-page-id'].time().$_GET['hlp-variant-id'];
$hash = md5(sha1($hash_str));
setcookie('zls12', $hash);

require_once 'php/hlp_function.php';
require_once 'php/HlpAnalyticsSite.php';

$folderAdmin = 'admin';
$pageId = $_GET['hlp-page-id']; 
$currentPageId = $_GET['hlp-variant-id'];
$cookieVariantKey = 'hlp-page-'.$pageId;
$cmsIndex = getCmsIndex();

$anlObj = new HlpAnalyticsSite($folderAdmin);
// фиксируем визит страницы
$cookieVisitPage = $cookieVariantKey . '_'.$cmsIndex.'_'.date('ymd');
if (!array_key_exists($cookieVisitPage, $_COOKIE)) {
	$anlObj->fixedVisitPage($pageId, $currentPageId);
	$anlObj->fixedVisitAbtest($pageId, $currentPageId);
	setcookie($cookieVisitPage, '1', time() + 3600*24*356);
}

// фиксируем визит сайта
$anlObj->fixedVisitSite($cmsIndex);

?>

