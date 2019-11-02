<?php  
/**
* Для редактора
*
*
*
*/
class DbSiteEditor extends Db {
	/**
	* Отдает только сайт  для редактора
	*
	* @see EditorController::indexAction()
	*/
	public function isExistsSite($params)
	{
		$sql = "SELECT id 
					FROM site_site 
					WHERE profile_id = :profile_id
						AND id = :site_id
						AND date_delete IS NULL";
		$res = $this->select($sql, $params);
		
		if ($res) return true;
		else return false;
	}

/***отдает при загрузки***********************************************************************************/
	/**
	* Отдаем полностью сайт для
	*
	* @see 	EditingController::indexAction()
	* @see 	DownloadController::shapeHtmlAction() 	
	* @see 	Image->replaceImage()
	*/
	public function getFullSite($params)
	{
		$rootPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $params['profile_id'] . '/' . $params['site_id'];
		$filePath = $rootPath . '/code.txt';
		$res = file_get_contents($filePath);

		$res = json_decode($res, true);
		$res['style_name'] = '';
		
		return $res;
	}

	/**
	* Сохраняет
	*
	* @see 	IndexController->saveSiteAction()
	* @see 	Image->replaceImage()
	*/
	public function saveSite($profileId, $siteId, $code, $abtest = false) 
	{
		if (is_array($code)) {
			$code = json_encode($code, true);
		}

		$rootPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $profileId . '/' . $siteId;
		$filePath = $rootPath . '/code.txt';
		file_put_contents($filePath, $code);

		$fileShowPath = $rootPath . '/show';
		if (file_exists($fileShowPath)) Dir::remove($fileShowPath);

		return true;
	}

}//end class

?>
