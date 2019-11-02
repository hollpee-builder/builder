<?php  
/**
* Формат страницы 
*
*
*
*/
class FormatPageLPF extends FormatPage {
	// protected $archive_format = 'hollpee.rar';
	protected $archive_format = 'hollpee';
	protected $isAllImg = false;
	protected $type = 'lpf';
	private $httpCode = '@@@@@hp@@@@@';

/****************************************************************************************************/
	/**
	* Создает текстовый фаил
	*
	* @return 	void
	* @uses 	$this->create()
	*/
	protected function createTextFile()
	{
		// шрифты
		$this->addFontLocal();

		// переводим в json
		$siteJson = $this->getSiteForDownload();

		// записываем данные в фаил
		$file_path = $this->pathProject.'/site.txt';
		$file = fopen($file_path, 'w');
		fwrite($file, $siteJson);
		fclose($file);
	}

	private function getSiteForDownload()
	{
		$site = $this->siteData;
		$siteId = $site['site_id'];
		$typeAccess = 'free';

		$site = json_encode($site, true);
		// заменяем htttp
		$site = preg_replace('/http/', $this->httpCode, $site);

		$newKeyId = Key::getNewId();
		$newKey = Key::get($newKeyId);
		$siteKey = $siteKeyData['encryption_key'];
		$siteEncryp = openssl_encrypt($site, 'AES-256-CTR', $newKey);
		
		// записуем meta data
		$fileMetaPath = $this->pathProject.'/hollpee_meta.txt';
		$fileMetaContent = array('id'=>$newKeyId);
		$fileMetaContent = json_encode($fileMetaContent, true);
		file_put_contents($fileMetaPath, $fileMetaContent);

		$this->pageName = $this->pageName;

		return $siteEncryp;
	}


/********************************************************************************************/
	/**
	* Добавляем
	* 
	* @see 	$this->createTextFile()
	*/
	private function addActionPageId()
	{
		$siteUploadValue = array();
		foreach ($this->siteData['pages'] as $iPage => $page) {
			$siteUploadValue[$iPage] = $page['page_id'];
		}
		
		// делаем отметку что это upload
		$siteData = json_decode($this->siteData['data'], true);
		if (!$siteData) $siteData = array();
		
		$siteData['site_upload'] = $siteUploadValue;
		$this->siteData['data'] = json_encode($siteData, true);
	}


/********************************************************************************************/
/***********************************************************************************************/
	/**
	* Загрузка файла
	*
	* @see 	DownloadController->
	*/
	public function upload($activationKey = false)
	{
		// перемещаем фаил в папку пользователя
		$this->fileFolder = $this->moveUploadFile();

		// распаковываем
		$this->unrarUploadFile();

		//получаем сайт 
		$resSite = $this->getUploadSiteCode();
		$site = $resSite['code'];
		$accessType = $resSite['type_access'];
		$this->site = $site;

		// заносим данные из файла в бд
		$listSiteId = $this->addInDB($accessType);
		if (!$listSiteId) return false;

		$siteId = $listSiteId['new'];
		$oldSiteId = $listSiteId['old'];

		// создаем папки
		$this->pathNewSite = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->userId.'/'.$siteId;

		// копируем картинки
		Site::copy($this->rootFolder, $this->pathNewSite);
		//заменяем в html
		Image::replaceImage($this->userId, $siteId, true);

		// убираем папку
		if (file_exists($this->rootFolder)) Dir::remove($this->rootFolder);
		
		// возращяем результат
		return $listSiteId;
	}

	/**
	* Отдает код сайта
	*
	*
	*/
	private function getUploadSiteCode()
	{
		$siteEnc = file_get_contents($this->rootFolder.'/site.txt');
		$fileMetaPath = $this->rootFolder.'/hollpee_meta.txt';

		$meta = json_decode(file_get_contents($fileMetaPath), true);
		$params = array('profile_id' => $this->userId, 'hash' => $meta['id']);
		
		$resKey = $this->getEncryptionKeyPrivateUpload($params, $siteEnc);

		if ($resKey['status'] == 'error') {
			echo json_encode($resKey, true);
			exit;
		} else {
			$key = $resKey['value'];
		}

		$site = openssl_decrypt($siteEnc, 'AES-256-CTR', $key);
		$res = array('code'=>$site, 'type_access'=>$resKey['type_access']);
		
		if (array_key_exists('project_id', $resKey)) {
			$res['project_id'] = $resKey['project_id'];
		}

		return $res;
	}

	/**
	*
	*
	* @see 	this::getUploadSiteCode()
	*/
	public function getEncryptionKeyPrivateUpload($params, $siteEnc)
	{
		$keyId = $params['hash'];
		$encKey = Key::get($keyId);

		$siteJson = openssl_decrypt($siteEnc, 'AES-256-CTR', $encKey);
		$siteData = json_decode($siteJson, true);
		/*********************************************/
		/*********************************************/

		if (!$siteData) {
			return array('status'=>'error', 'strerror'=>'no_exists_hash');
		}
		// $siteData['type_access'] = 'free';
		if ($siteData['type_access'] == 'free'
				// загружает в свой аккаунт
				|| $params['profile_id'] == $siteData['profile_id']) {
			
			return array(
				'status'=>'success',
				'type_access'=>$siteData['type_access'],
				'value'=>$encKey
			);
		} else {
			return array('status'=>'error', 'strerror'=>'private_template'); 
		}
	}
	

/*********************************************************************************************/
	/**
	* Перемещаем фаил в папку пользователя
	*
	* @return 	string  имя загруженого файла
	*/
	private function moveUploadFile()
	{
		$file = $_POST['content'];
		$fileName = ConvertStr::ruToEn($_POST['name']);

		// получаем сам фаил
		$data = explode(',', $file);
		$encodedData = str_replace(' ','+',$data[1]);
		$fileData = base64_decode($encodedData);

		// сохраняем
		$fileTo = $this->rootFolder.'/'.$fileName;
		$res = file_put_contents($fileTo, $fileData);

		if (!$res) exit;

		// фиксируем пути
		$folderName = preg_replace('|\.'.$this->archive_format.'$|', '', $fileName);
		$fileFolder = $this->rootFolder.'/'.$folderName;
		
		return $fileFolder;
	}

/**************************************************************************************************/
	/**
	* Распаковываем фаил
	*
	* @param 	string 	$fileName - имя загруженого файла
	*/
	private function unrarUploadFile()
	{
		$fileName = $this->fileFolder.'.'.$this->archive_format;

		// разворачиваем
		$zip = new ZipArchive;
		if ($zip->open($fileName) === TRUE) {
		    $zip->extractTo($this->rootFolder);
		    $zip->close();
		} else {
		    exit;
		}
		unlink($fileName);
	}

/************************************************************************************************/
	/**
	* Заносим в БД
	*
	* @see 	$this->upload()
	*/
	private function addInDB($accessType)
	{
		$site = json_decode($this->site, true);
		$oldSiteId = $site['site_id'];

		// убираем лишние
		unset($site['data']);
		unset($site['site_id']);
		unset($site['integration_api']);
		unset($site['integration_code']);

		// изменяем поля
		$site['profile_id'] = $this->userId;
		$site['project_id'] = $_SESSION['project'];
		$site['type_access'] = $accessType;

		if (!array_key_exists('type', $site) || empty($site['type'])) 
			$site['type'] = 'lp';

		// заносим его в бд
		$siteId = DbSite::getInstance()->addFullSite($site);

		// отдает рузультат
		if ($siteId) {
			// создаем папку
			$newSiteFolderPath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->userId.'/'.$siteId;
			if (!file_exists($newSiteFolderPath)) mkdir($newSiteFolderPath);
			
			// отдаем
			return array('new'=>$siteId, 'old'=>$oldSiteId);
		} else {
			return false;
		}
	}

/************************************************************************************************/
	/**
	* Отдает картинку стиля
	*
	* @see 	$this->upload()
	*/
	private function getStyleImg()
	{	
		$site = json_decode($this->site, true);
		$params = array('style_id'=>$site['style_id']);

		$img = DbStyle::getInstance()->getSiteImg($params);

		$img = '/img/style_site/'.$img;

		return $img;
	}


/***********************************************************************************************/
/**********************************************************************************************/
}
