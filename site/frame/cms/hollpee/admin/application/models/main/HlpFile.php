<?php 
/**
* Работа с файлом
*
*
*/
class HlpFile {
	/**
	* Сохранение файла
	*
	* @see 	EditorController.addFileAction()
	* @see 	IndexController.saveFaviconAction()
	*/
	public function save($fileName, $fileContent, $folder = '/')
	{		
		$fileName = HlpConvertStr::ruToEn($fileName);

		// проверка на загрузку
		// $this->checkFileValid($fileName);

		// Выделим данные
		$data = explode(',', $fileContent);
		// Декодируем данные, закодированные алгоритмом MIME base64
		$encodedData = @str_replace(' ', '+', $data[1]);
		$imgData = base64_decode($encodedData);

		// путь папки
		$pathFolder = HLP_SITE_FOLDER_PATH . $folder . '/';
		if (!file_exists($pathFolder)) mkdir($pathFolder); 

		//путь к файлу
		$filePath = $this->getNewName($pathFolder, $fileName);
		file_put_contents($pathFolder.$filePath, $imgData); //сохраняем

		return $folder .'/' . $filePath;
	}

	/**
	* Проверяет фаил на соответствие
	*
	* @see 	this.saveFileAction()
	*/
	private function checkFileValid($fileName)
	{
		if ($fileType == 'images') $isImg = preg_match("/(png)|(jpe?g)|(gif)|(svg)|(ico)/i", $fileName);
		else if ($fileType == 'video') $isImg = preg_match("/mp4/i", $fileName);
		else $isImg = true;

		if (!$isImg) {
			echo "__no_valid__";
			exit;
		} else if ($_FILES['new_image']['error'] == 1) {// привышен размер
			echo "__max_size__";
			exit;
		}
	}

	/**
	* Отдает путь новому файлу
	*
	* @see 	$this->save()
	* @see  IndexController->copyPageAction()
	*/
	public function getNewName($pathFolder, $fileName)
	{	
		$imageProperty = array();
		preg_match_all("|^([\w\-\.]+)\.([\w]+)$|i", $fileName, $imageProperty);
		$name = $imageProperty[1][0];
		$unit = $imageProperty[2][0];

		for ($i=0; $i < 100; $i++) {
			$nameNum = $name;
			if ($i) $nameNum .= '_' . $i;

			$newName = $nameNum.'.'.$unit;
			$imgPath = $pathFolder . '/' . $newName;
			if (!file_exists($imgPath)) break;
		}
	
		return $newName;
	}

/*************************************************************************************/
	
	/**
	* Отдает путь к abtest
	*
	*
	*/
	public static function getAbtestPath($pageId, $folder = false)
	{
		$rootFolder = 'data/abtest';
		if ($folder) $rootFolder = $folder . '/' . $rootFolder;
		if (!file_exists($rootFolder)) mkdir($rootFolder);

		$path = $rootFolder.'/abtest_'.$pageId.'.txt';
		return $path;
	}

	public static function getDymTitlePath($pageId, $folder = false)
	{
		$rootFolder = 'data/dymtitle';
		if ($folder) $rootFolder = $folder . '/' . $rootFolder;
		if (!file_exists($rootFolder)) mkdir($rootFolder);

		$path = $rootFolder.'/dymtitle_'.$pageId.'.txt';
		return $path;
	}

	public static function getUtmPricePath()
	{
		return  HLP_ADMIN_FOLDER_PATH . '/data/utm_cost.txt';
	}

/*************************************************************************************/
	
	/**
	* Отдает список картинок
	*
	* @see 	HlpEditorController::indexAction()
	* @see 	HlpPageController::indexAction()
	*/
	public static function getListFile($fileType, $folder = '', $parentId = '')
	{
		$rootPath = HLP_SITE_FOLDER_PATH;

		$imgPath = $rootPath . '/' . $fileType . $folder;
		if (!file_exists($imgPath)) return array(); 

		$dir = opendir($imgPath);

		$listImg = array();
		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..' || $file == 'index.html') continue;
			else if (preg_match('/~$/', $file)) continue;

			$src = $fileType . $folder . '/' . $file;
			$imgItemPath = $rootPath . '/' . $src;
			$type = is_dir($imgItemPath) ? 'dir' : 'file';
			$listImg[$src] = array(
				'name' => $file,
				'src' => $src,
				'parent_id' => $parentId,
				'type' => $type
			);

			if (is_dir($imgItemPath)) {
				$newParentId = '/' . $file;
				$newFolder = $folder . '/' . $file;
				$childListImg = self::getListFile($fileType, $newFolder, $newParentId);
				$listImg = array_merge($listImg, $childListImg);
			}
		}

		closedir($dir);

		return $listImg;
	}

/*************************************************************************************/
	
	/**
	* Скачивание файла
	*
	*
	*/
	public static function download($file, $noDelete = false)
	{
		// если этого не сделать файл будет читаться в память полностью!
		if (ob_get_level()) ob_end_clean();
		ob_end_flush();

		
		// заставляем браузер показать окно сохранения файла
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header('Content-Disposition: attachment; filename=' . basename($file));
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate');
		header('Pragma: public');
		header('Content-Length: ' . filesize($file));

		// читаем файл и отправляем его пользователю
		readfile($file);

		if (!$noDelete) {
			unlink($file);
		}
	}

} // end class

?>
