<?php 
/**
* Работа с файлом
*
*
*/
class File {
	/**
	* Сохранение файла
	*
	*
	*/
	public function save($fileName, $fileContent, $folder = '/')
	{		
		$fileName = ConvertStr::ruToEn($fileName);

		// проверка на загрузку
		// $this->checkFileValid($fileName);

		// Выделим данные
		$data = explode(',', $fileContent);
		// Декодируем данные, закодированные алгоритмом MIME base64
		$encodedData = str_replace(' ','+',$data[1]);
		$imgData = base64_decode($encodedData);

		// путь папки
		$pathFolder = $_SERVER['DOCUMENT_ROOT'] . $folder . '/';
		if (!file_exists($pathFolder)) mkdir($pathFolder); 

		//путь к файлу
		$filePath = $this->getNewName($pathFolder, $fileName);

		$filePathFull = $pathFolder.$filePath;
		$filePathFull = preg_replace('/\.\./', '', $filePathFull);
		file_put_contents($filePathFull, $imgData); //сохраняем
	
		return $filePath;
	}

	/**
	* Проверяет фаил на соответствие
	*
	* @see 	this.saveFileAction()
	*/
	private function checkFileValid($fileName)
	{
		if ($fileType == 'img') $isImg = preg_match("/(png)|(jpe?g)|(gif)|(svg)|(ico)/i", $fileName);
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
	* @see  IndexController->addTemplateAction()
	*/
	public function getNewName($pathFolder, $fileName)
	{	
		$imageProperty = array();
		if (preg_match('/\.[\w]+$/', $fileName)) {
			preg_match_all("|^([\w\-\.]+)\.([\w]+)$|i", $fileName, $imageProperty);
			$name = $imageProperty[1][0];
			$unit = '.' . $imageProperty[2][0];
		} else {
			$name = $fileName;
			$unit = '';
		}
			

		// if (preg_match('/^[0-9]/', $name)) $name = 'a' . $name;

		for ($i=0; $i < 100; $i++) {
			$nameNum = $name;
			if ($i) $nameNum .= '_' . $i;

			$newName = $nameNum.$unit;
			$imgPath = $pathFolder . '/' . $newName;
			if (!file_exists($imgPath)) break;
		}
	
		return $newName;
	}


/***********************************************************************************/

	/**
	* Скачивание файла
	*
	* @see 	DownloadController::lpfAction()
	* @see 	DeveloperController::downloadAction()
	*/
	public function download($file, $noDelete = false)
	{

		// сбрасываем буфер вывода PHP, чтобы избежать переполнения памяти выделенной под скрипт
	    // если этого не сделать файл будет читаться в память полностью!
	    if (ob_get_level()) {
	      ob_end_clean();
	    }

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

	    // убираем фаил
	    if (!$noDelete) unlink($file);

	    exit;
	}



} // end class

?>
