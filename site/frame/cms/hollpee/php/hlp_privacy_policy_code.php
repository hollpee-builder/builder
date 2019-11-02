<?php 
	setConstPath();
	$folderDbPath = 'admin/application/models/db';
	$dbPath = $folderDbPath . '/HlpDb.php';
	$dbAdminPath = $folderDbPath . '/HlpDbAdmin.php';
	if (file_exists($dbPath) && file_exists($dbAdminPath)) {
		include_once $dbPath;
		include_once $dbAdminPath;
		$profileInfo = HlpDbAdmin::getInstance()->getProfileInfo();
		$profileOrganization = array_key_exists('organization', $profileInfo) ? $profileInfo['organization'] : 'Организация';
		$profileAddress = array_key_exists('address', $profileInfo) ? $profileInfo['address'] : 'Адрес';
		$host = 'www.' . $_SERVER['HTTP_HOST'];
		$profileEmail = array_key_exists('email', $profileInfo) ? $profileInfo['email'] : 'Email';
	}
?>