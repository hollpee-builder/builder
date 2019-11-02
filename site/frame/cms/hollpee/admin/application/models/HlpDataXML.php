<?php  
/**
* Работа с файлом data
*
*
*
*/
class HlpDataXML {

	/**
	* Отдает customizer
	*
	* @see 	EditorController::indexAction()
	*/
	public function getCustomizer($fileName)
	{
		$xmlPath = HLP_SITE_FOLDER_PATH . '/data/customizer/hlp_customizer_'.$fileName.'.xml';
		if (!file_exists($xmlPath)) return false;

		// загружаем xml
		$doc = simplexml_load_file($xmlPath);
		if (!$doc) return false;
		$listCustomizer = $doc->xpath('//customizer');
		$countCustomizer = count($listCustomizer);
		if (!$countCustomizer) return false;
			
		// формируем массив 
		$listCustArr = array();
		for ($iCustomizer = 0; $iCustomizer < $countCustomizer; $iCustomizer++) {
			$customizerItem = $listCustomizer[$iCustomizer];
			$customizerName = $customizerItem->name->__toString();
			$customizerValue = $customizerItem->value->__toString();
			
			$listCustArr[trim($customizerName)] = trim($customizerValue);
		}
		return $listCustArr;
	}

	/**
	* Сохраняет customizer
	*
	* @see 	EditorController::saveCustomizer()
	*/
	public function saveCustomizer($fileName, $listCustomizer)
	{
		if (!is_array($listCustomizer)) return false;

		$t0 = "\r\n";
		$t1 = $t0 . " ";
		$t2 = $t1 . " ";

		$data = '<?xml version="1.0" encoding="utf-8"?>';
		$data .= $t0 . '<listCustomizer>';
		foreach ($listCustomizer as $customizerName => $customizerValue) {
			$customizerValue = htmlspecialchars($customizerValue);
			$customizerName = trim($customizerName);
			$data .= $t1 . '<customizer>';
			$data .= $t2 . '<name>' . $customizerName . '</name>';
			$data .= $t2 . '<value>' . $customizerValue . '</value>';
			$data .= $t1 . '</customizer>';
		}

		$data .= $t0 . '</listCustomizer>' . $t0;

		$filePath = HLP_SITE_FOLDER_PATH . '/data/customizer/hlp_customizer_'.$fileName.'.xml';
		@file_put_contents($filePath, $data);
	}

	/**
	* Создает документ
	* 
	* @see 	this::copyPage()
	* @see 	this::deletePage()
	*/
	private function createDocument($dataPath = false)
	{
		if (!$dataPath) {
			$dataPath = HLP_SITE_FOLDER_PATH . '/data/hlp_site.xml';;
		}

		$doc = new DOMDocument();
		$doc->preserveWhiteSpace = false;
		$doc->formatOutput = true;
		$doc->load($dataPath);

		return $doc;
	}

/*************************************************************************************************/

} // end class

?>
