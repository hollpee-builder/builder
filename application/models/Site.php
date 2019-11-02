<?php  
class Site {

	/**
	* Копирует файлы сайта
	*
	* @see 	ChosenStyleController::copyFileForNewSite()
	* @see 	SiteController::copySiteAction()
	* @see 	FormatingPage::upload()
	*/
	public static function copy($oldFolderPath, $newFolderPath)
	{
		if (!file_exists($newFolderPath)) mkdir($newFolderPath);

		// переносим картинки в папку
		Dir::copy($oldFolderPath.'/images', $newFolderPath.'/img');

		Dir::copy($oldFolderPath.'/img', $newFolderPath.'/img');
		Dir::copy($oldFolderPath.'/file', $newFolderPath.'/file');
		Dir::copy($oldFolderPath.'/fonts', $newFolderPath.'/fonts');
		
		Dir::copy($oldFolderPath.'/avatar.png', $newFolderPath.'/avatar.png');

		Dir::copy($oldFolderPath.'/integration_api.txt', $newFolderPath.'/integration_api.txt');
		Dir::copy($oldFolderPath.'/integration_code.txt', $newFolderPath.'/integration_code.txt');

	}

/**********************************************************************************/

	/**
	*
	*
	*
	* @see 	ChoseStyleController::addStyleSite()
	* @see 	LoginController::createDefaultForNewUser()
	*/
	public function addStyleSite($params)
	{
		$this->user_id = $params['profile_id'];
		$site = $this->getStyleAdd($params);
			
		$newSiteId = DbSite::getInstance()->addFullSite($site);	

		if ($newSiteId) {
			// заменяем картинки в файле
			Image::replaceImage($this->user_id, $newSiteId, false, true);

			// копируем файлы
			$this->copyFileForNewSite($newSiteId);

			return $newSiteId;
		} else {
			return false;
		}
	}

	/**
	* Копирует сайты для нового сайта
	*
	* @see this.addStyleSiteAction
	*/
	private function copyFileForNewSite($newSiteId)
	{
		// пути
		$pathOldSite = $this->pathStyle;
		$pathNewSite = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->user_id.'/'.$newSiteId;
		//копируем файлы
		Site::copy($pathOldSite, $pathNewSite);
	}


	/**
	* Отдает стиль который добавляем
	*
	* @see 	$this->addStyleSite();
	*/
	private function getStyleAdd($params)
	{
		$styleId = $params['style_id'];
		$styleType = $params['style_type'];
		$styleName = $params['style_name'];

		$pathStyle = $_SERVER['DOCUMENT_ROOT'].'/site/style/'.$styleType.'/'.$styleId;
		$this->pathStyle = $pathStyle;
		$siteString = file_get_contents($pathStyle.'/code.txt');

		$projectId = $_SESSION['project'];
		$paramsProject = array('profile_id'=>$this->user_id, 'project_id'=>$projectId);
		$isProjectExists = DbSite::getInstance()->isProjectExists($paramsProject);
		if (!$isProjectExists) {
			$projectId = DbSite::getInstance()->getFirstProjectId(array('profile_id'=>$this->user_id));
			$projectId = $projectId[0]['id'];
		}

		/*******/
		$site = array();
		$site['profile_id'] = $this->user_id;
		$site['project_id'] = $projectId;
		// $site['style_id'] = $styleId;
		$site['style_name'] = $styleName;
		$site['type'] = $styleType;
		
		$siteCode = json_decode($siteString, true);
		unset($siteCode['profile_id']);
		unset($siteCode['project_id']);
		unset($siteCode['site_id']);
		unset($siteCode['style_id']);
		unset($siteCode['style_name']);
		$site['code'] = json_encode($siteCode, true);
		/*******/

		return $site;
	}

/**********************************************************************************/

	/**
	* Отдает ключ шифрования
	*
	* @see 	FormatPageLPF::getSiteForDownload()
	* @see 	FormatPageLPF::getEncryptionKeyPrivateUpload()
	*
	* @see 	DeveloperController::uploadProjectAction()
	* @see 	FormatPageLPF::getEncryptionKeyCommerceUpload()
	*/
	public static function getEncrKey($keyId)
	{
		$keyPath = $_SERVER['DOCUMENT_ROOT'] . '/site/key/key_'.$keyId.'.key'; 

		$key = file_get_contents($keyPath);
		return trim($key);
	}

	/**
	* Отдает новый ключа id шифрования
	*
	* @see 	FormatPageLPF::getSiteForDownload()
	* @see 	DeveloperController::uploadProjectAction()
	*/
	public static function getNewEncrKeyId()
	{
		return mt_rand(1,10);
	}

} // end class

?>
