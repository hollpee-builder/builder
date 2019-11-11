<?php  
header('Content-Type: text/html; charset=utf-8');
setConstPath();

$fileName = $_GET['hlp-page-name'];
$siteId = $_GET['hlp-page-id'];

$adaptiveTitlePath = getDymTitleFilePath($siteId);
if (file_exists($adaptiveTitlePath)) {
	$adaptiveTitleJson = file_get_contents($adaptiveTitlePath);
} else {
	$adaptiveTitle = array();
	$adaptiveTitleJson = json_encode($adaptiveTitle, true);
}

require_once $siteId.'.php';


echo '	<link rel="stylesheet" href="/'.HLP_ADMIN_FOLDER.'/css/main/widget.css" >
		<link rel="stylesheet" href="/'.HLP_ADMIN_FOLDER.'/css/add_adaptive_elm.css">
		<script type="text/javascript" src="/'.HLP_ADMIN_FOLDER.'/js/main/widget.js" ></script>
		<script type="text/javascript" src="/'.HLP_ADMIN_FOLDER.'/js/page/add_adaptive_elm.js"></script>
		<div id="listJson" style="display:none;">
			<div id="siteId">'.$siteId.'</div>
			<div id="adaptiveTitleJson">'.$adaptiveTitleJson.'</div>
		</div>
		<script>
			var HLP_PAGE_ID = 0;
			var ADMIN_FOLDER = "'.HLP_ADMIN_FOLDER.'";
		</script>			
		';

?>
