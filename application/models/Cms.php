<?php  
class Cms {
	private $logoWhiteName = 'logo_w.png';
	private $logoBlackName = 'logo_b.png';
	private $folderLogoDef = '/site/frame/cms/hollpee/admin/img/logo';

	/**
	*
	*
	* @see 	CmsController->indexAction()
	*/
	public function getLogoSrc($userId)
	{
		// имена лого
		$logoWhiteName = $this->getLogoWhiteName();
		$logoBlackName = $this->getLogoBlackName();

		// пути
		$folderLogoDef = $this->getFolderLogoDef();
		$folderCmsUser = $this->getFolderCmsUser($userId);
		$folderLogoUser = $this->getFolderLogoUser($userId);
		$logoWhiteUser = $folderLogoUser . '/' . $logoWhiteName;
		$logoBlackUser = $folderLogoUser . '/' . $logoBlackName;
		$logoWhiteDef = $folderLogoDef . '/' . $logoWhiteName;
		$logoBlackDef = $folderLogoDef . '/' . $logoBlackName;

		// создаем папки
		$folderCmsUserPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $folderCmsUser;
		$folderLogoUserPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $folderLogoUser;
		if (!file_exists($folderCmsUserPath)) mkdir($folderCmsUserPath);
		if (!file_exists($folderLogoUserPath)) mkdir($folderLogoUserPath);

		// узнаем есть ли
		$logoWhite = file_exists($_SERVER['DOCUMENT_ROOT'].$logoWhiteUser) ? $logoWhiteUser : $logoWhiteDef;
		$logoBlack = file_exists($_SERVER['DOCUMENT_ROOT'].$logoBlackUser) ? $logoBlackUser : $logoBlackDef;

		$logoSrc = array(
			'white' => $logoWhite,
			'black' => $logoBlack
		);

		return $logoSrc;
	}

	public function logoUpload($userId, $type)
	{
		$data = explode(',', $_POST['content']);
		// Декодируем данные, закодированные алгоритмом MIME base64
		$encodedData = str_replace(' ','+',$data[1]);
		$logoData = base64_decode($encodedData);

		$folderLogoUser = $this->getFolderLogoUser($userId);
		$logoName = $this->getLogoName($type);
		$logoPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $folderLogoUser . '/' . $logoName;

		file_put_contents($logoPath, $logoData);
		
		return true;
	}

	public function deleteUpload($userId, $type)
	{
		$logoPath = $this->getLogoPath($userId, $type);
		if (file_exists($logoPath)) unlink($logoPath);

		return true;
	}

/***********************************************************************************/
	
	/**
	*
	*
	* @see 	FormatPageHTML::createFileCmsHollpee()
	*/
	public function copyLogoAdmin($userId, $adminFolderLogoPath)
	{
		$logoWhiteName = $this->getLogoWhiteName();
		$logoBlackName = $this->getLogoBlackName();

		$folderCmsUser = $this->getFolderLogoUser($userId);
		$folderCmsUserPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $folderCmsUser;
		
		// user
		$logoWhiteUserPath = $folderCmsUserPath . '/' . $logoWhiteName;
		$logoBlackUserPath = $folderCmsUserPath . '/' . $logoBlackName;

		// admin
		$logoWhiteAdminPath = $adminFolderLogoPath . '/' . $logoWhiteName;
		$logoBlackAdminPath = $adminFolderLogoPath . '/' . $logoBlackName;

		if (file_exists($logoWhiteUserPath)) {
			if (file_exists($logoWhiteAdminPath)) unlink($logoWhiteAdminPath);
			copy($logoWhiteUserPath, $logoWhiteAdminPath);
		}

		if (file_exists($logoBlackUserPath)) {
			if (file_exists($logoBlackAdminPath)) unlink($logoBlackAdminPath);
			copy($logoBlackUserPath, $logoBlackAdminPath);
		}
	}


	
	private function getLogoPath($userId, $type)
	{
		$name = $this->getLogoName($type);
		$folder = $this->getFolderLogoUser($userId);

		$path = $_SERVER['DOCUMENT_ROOT'] . '/' . $folder . '/' . $name;

		return $path;
	}


	private function getLogoName($type)
	{
		return $type == 'white' ? $this->getLogoWhiteName() 
									: $this->getLogoBlackName();
	}

	private function getLogoWhiteName()
	{
		return $this->logoWhiteName;
	}

	private function getLogoBlackName()
	{
		return $this->logoBlackName;
	}

	private function getFolderLogoDef()
	{
		return $this->folderLogoDef;
	}

	private function getFolderCmsUser($userId)
	{
		return '/user/'.$userId.'/0_cms';
	}

	private function getFolderLogoUser($userId)
	{
		$folderCms = $this->getFolderCmsUser($userId);
		$folderLogo = $folderCms . '/logo';
		
		return $folderLogo;
	}

/*********************************************************************************/

} // end class

?>
