<?php  
/**
* Работа с лидами
*
*
*/
class HlpLead {
	/**
	* Количество лидов на странице
	*
	*/
	private static $countLeadInPage = 20;

	public static $listStatusName = array(
		'new' => 'Новый',
		'read' => 'Прочитан',
		'success' => 'Продажа',
		'declined' => 'Отказ',
		'message' => 'Отправил сообщение',
		'call' => 'Перезвонить',
		'comment' => 'Комментарий',
		'not_available' => 'Недоступен'
	);

	/**
	* Добавляет новый
	*
	* @see 	FormController::indexAction()
	*/
	public static function addNew($property, $formName,  $pageId = NULL, $variantId = NULL, $utmSrc = NULL)
	{
		$url = urldecode($_SERVER['HTTP_REFERER']);
		$url = preg_replace('/\?[^\?]*$/', '', $url);

		$device = HlpDevice::getData();

		$email = array_key_exists('email', $property) ? $property['email'] : '';
		$name = array_key_exists('name', $property) ? $property['name'] : '';
		$phone = array_key_exists('phone', $property) ? $property['phone'] : '';
		$addr = array_key_exists('addr', $property) ? $property['addr'] : '';
		$price = array_key_exists('price', $property) ? $property['price'] : '';

		if (array_key_exists('email', $property)) unset($property['email']);
		if (array_key_exists('name', $property)) unset($property['name']);
		if (array_key_exists('phone', $property)) unset($property['phone']);
		if (array_key_exists('addr', $property)) unset($property['addr']);
		if (array_key_exists('price', $property)) unset($property['price']);

		$ip = array_key_exists('REMOTE_ADDR', $_SERVER) ? $_SERVER['REMOTE_ADDR'] : NULL;
		

		if (array_key_exists('hlp-file-1', $_FILES)) {
			$property['hlp-file'] = self::isExistsLeadFiles() ? 1 : 0;
		}

		$data = json_encode($property, true);
		$params = array(
			'page_id' => $pageId,
			'variant_id' => $variantId,
			'url' => htmlspecialchars($url),
			'form_name' => htmlspecialchars($formName),
			'email' => $email,
			'name' => $name,
			'phone' => $phone,
			'addr' => $addr,
			'price' => $price,
			'data' => $data,
			'ip' => $ip,
			'os' => $device['os'],
			'device' => $device['device'],
			'browser' => $device['browser'],
			'utm_source' => $utmSrc
		);

		$leadId = HlpDbLead::getInstance()->add($params);
			
		// сохраняем файл
		if (array_key_exists('hlp-file', $property) && $property['hlp-file']) {
			self::saveFile($leadId);
		}

		return $leadId;
	}

	public static function isExistsLeadFiles()
	{
		if (array_key_exists('hlp-file-1', $_FILES)) {
			for ($iFile = 1; $iFile < 20; $iFile++) {
				$fileKey = 'hlp-file-'.$iFile;
				if (!array_key_exists($fileKey, $_FILES)) break;
				if ($_FILES[$fileKey]['name']) {
					return true;
				}
			}
		}
		return false;
	}

	public static function getFolderAllFiles()
	{
		return HLP_ADMIN_FOLDER_PATH.'/data/lead_files/';
	}

	public static function getFolderFiles($leadId)
	{
		return self::getFolderAllFiles() . '/lead_'.$leadId.'.zip';
	}

	private static function saveFile($leadId)
	{
		$pathFolder = self::getFolderAllFiles();
		if (!file_exists($pathFolder)) mkdir($pathFolder);
		$pathFolderLead = $pathFolder.$leadId;
		if (!file_exists($pathFolderLead)) mkdir($pathFolderLead);
		
		$zip = new ZipArchive;
		$res = $zip->open(self::getFolderFiles($leadId), ZipArchive::CREATE);

		for ($iFile = 1; $iFile < 20; $iFile++) {
			$inputFileName = 'hlp-file-'.$iFile;
			if (array_key_exists($inputFileName, $_FILES)) {
				$fileName = $_FILES[$inputFileName]['name'];
				if (!$fileName) continue;

				$fileName = HlpConvertStr::ruToEn($fileName);

				$fullPathImg = $pathFolderLead.'/'.$fileName;
				move_uploaded_file($_FILES[$inputFileName]['tmp_name'], $fullPathImg);
				$zip->addFile($fullPathImg, $fileName);
			} else {
				break;
			}
		}

		$zip->close();
		HlpDir::remove($pathFolderLead);
	}

	/**
	* Отправка на email
	*
	* @see 	FormController::indexAction()
	**/
	public static function sendEmail($lead, $formName, $leadId = '')
	{
		$viewObj = new HlpView();
		$lead = json_encode($lead, true);
		$params = array('formName' => $formName, 'leadId'=>$leadId, 'lead' => $lead);
		$message = $viewObj->render('email.php', $params);
		$email = HlpDbAdmin::getInstance()->getEmail();
		$subject = 'Новый лид #'.$leadId.' с сайта ' . $_SERVER['HTTP_HOST'];

		HlpEmail::send($email, $subject, $message);
	}

/*********************************************************************************************/
	
	/**
	* Отдает список страниц
	*
	* @see 	LeadController::indexAction()
	*/
	public static function getList($pageNum, $pageId)
	{
		if (!$pageNum) $pageNum = 1;

		// получаем список
		$list = HlpDbLead::getInstance()->getList($pageId);
		$countInPage = self::$countLeadInPage;

		/*******************/
		// делаем фильтрацию
		$searchValue = array_key_exists('search-value', $_GET) ? $_GET['search-value'] : '';
		$searchType = array_key_exists('search-type', $_GET) ? $_GET['search-type'] : '';
		if ($list && is_array($list) && $searchType && $searchValue) {
			$new_list_lead = array();
			foreach ($list as $lead_id => $lead) {
				if ($lead[$searchType] != $searchValue) continue;
				$new_list_lead[$lead_id] = $lead;
			}
			$list = $new_list_lead;
		}
		/********************/

		// формируем список
		$iLeadEnd = $countInPage * $pageNum;
		$iLeadStart = $iLeadEnd - $countInPage;
		$listLead = array();

		$listFiles = HlpSite::getListPage();

		for ($iLead = $iLeadStart; $iLead < $iLeadEnd; $iLead++) {
			if (!$list || !array_key_exists($iLead, $list)) continue;
			$lead = $list[$iLead];
			// name
			$lead['status_name'] = self::$listStatusName[$lead['status']];

			if (array_key_exists('variant_id', $lead) 
					&& $lead['variant_id']
					&& array_key_exists($lead['variant_id'], $listFiles)) {
				$lead['file'] = $listFiles[$lead['variant_id']]['file'];
			} else {
				$lead['file'] = $lead['url'];
			}
			$listLead[$iLead] = $lead;
		}

		// отдает результат
		$countLead = count($list);
		$countPage = $countLead / $countInPage;
		if ($countLead % $countInPage) $countPage = floor($countPage) + 1;

		$result = array(
			'count_lead' => 	$countLead,
			'count_page' =>		$countPage,
			'lead_in_page' => 	$countInPage,
			'current_page' => 	$pageNum,
			'list_lead' => 	 	$listLead
		);

		return $result;
	}

/*********************************************************************************************/
	
	/**
	* Экспорт лида
	*
	* @see 	HlpLeadController::exportAction()
	*/
	public function export($type)
	{
		$listLead = HlpDbLead::getInstance()->getListExport();

		if ($type == 'xml') {
			return self::exportXml($listLead);
		} else if ($type == 'xlsx') {
			return self::exportXlsx($listLead);
		} else if ($type == 'vcf') {
			return self::exportVcf($listLead);
		} else if ($type == 'csv') {
			return self::exportCsv($listLead);
		}
	}

	public function exportXml($listLead)
	{
		$n = "\r\n";
		$t1 = $n."\t";
		$t2 = $t1."\t";

		$list = '';
		foreach ($listLead as $lead) {
			$dateUnix = $lead['date_add'];
			$date = date('d-m-Y h:i:s', $dateUnix);	

			$list .= $t1.'<contact>';
			$list .= $t2.'<name>'.$lead['name'].'</name>';
			$list .= $t2.'<email>'.$lead['email'].'</email>';
			$list .= $t2.'<phone>'.$lead['phone'].'</phone>';
			$list .= $t2.'<addr>'.$lead['addr'].'</addr>';
			$list .= $t2.'<date>'.$date.'</date>';
			$list .= $t1.'</contact>';
		}

		$content = '<?xml version="1.0" encoding="utf-8"?>';
		$content .= $n.'<listСontacts>';
		$content .= $list;
		$content .= $n.'</listСontacts>';

		return $content;
	}

	public static function exportVcf($listLead)
	{
		$n = "\r\n";
		$content = '';

		foreach ($listLead as $lead) {
			$content .= $n.'BEGIN:VCARD';
			$content .= $n.'VERSION:3.0';
			$content .= $n.'N;CHARSET=utf-8:'.$lead['name'].';;;;';
			$content .= $n.'FN;CHARSET=utf-8:'.$lead['name'];
			$content .= $n.'CATEGORIES;CHARSET=utf-8:';
			$content .= $n.'TEL;CHARSET=utf-8;type=OTHER;type=pref:'.$lead['phone'];
			$content .= $n.'EMAIL;type=INTERNET;type=WORK;type=pref:'.$lead['email'];
			$content .= $n.'END:VCARD';
			$content .= $n;
		}

		return $content;
	}

	public static function exportCsv($listLead)
	{
		$n = "\r\n";
		$content = 'Имя;Email;Телефон;Адрес;Дата';
		$content .= $n;

		foreach ($listLead as $lead) {
			$dateUnix = $lead['date_add'];
			$date = date('d-m-Y h:i:s', $dateUnix);	

			$content .= $lead['name'].';';
			$content .= $lead['email'].';';
			$content .= $lead['phone'].';';
			$content .= $lead['addr'].';';
			$content .= $date;
			$content .= $n;
		}

		return $content;
	}

	
	public function exportXlsx($listLead)
	{
		$nameFolderXLSX = 'hlp_contacts.xlsx_FILES';
		$downPath = HLP_ADMIN_FOLDER_PATH.'/data/down';
		$framePath = $downPath.'/frame/'.$nameFolderXLSX;
		$filePath = $downPath.'/file/'.$nameFolderXLSX;

		if (file_exists($filePath))	HlpDir::remove($filePath);
		HlpDir::copy($framePath, $filePath);

		$this->addXlsxShema($filePath, $listLead);
		$this->addXlsxValue($filePath, $listLead);

		return $filePath;

	}
	
	private function addXlsxShema($filePath, $listLead)
	{
		$fileValuePath = $filePath.'/xl/sharedStrings.xml';
		$listValueItem = '<si><t>Имя</t></si>';
		$listValueItem .= '<si><t>Email</t></si>';
		$listValueItem .= '<si><t>Телефон</t></si>';
		$listValueItem .= '<si><t>Адрес</t></si>';
		$listValueItem .= '<si><t>Дата</t></si>';
		$uniqueCount = 5;
		foreach ($listLead as $lead) {
			$dateUnix = $lead['date_add'];
			$date = date('d-m-Y h:i:s', $dateUnix);	

			$listValueItem .= '<si><t>'.$lead['name'].'</t></si>';
			$listValueItem .= '<si><t>'.$lead['email'].'</t></si>';
			$listValueItem .= '<si><t>'.$lead['phone'].'</t></si>';
			$listValueItem .= '<si><t>'.$lead['addr'].'</t></si>';
			$listValueItem .= '<si><t>'.$date.'</t></si>';

			$uniqueCount += 5;
		}
		$fileValue = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
		$fileValue .= "\r\n".'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" uniqueCount="'.$uniqueCount.'">'.$listValueItem.'</sst>';
		file_put_contents($fileValuePath, $fileValue);
	}

	private function addXlsxValue($filePath, $listLead)
	{
		$fileStrPath = $filePath.'/xl/worksheets/sheet1.xml';
		$listStr = '<row r="1" spans="1:5"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="s"><v>3</v></c><c r="E1" t="s"><v>4</v></c></row>';
		$row = 1;
		foreach ($listLead as $lead) {
			$num = $row * 5;
			$row++;
			$listStr .= '<row r="'.$row.'" spans="1:5"><c r="A'.$row.'" t="s"><v>'.$num.'</v></c><c r="B'.$row.'" t="s"><v>'.($num+1).'</v></c><c r="C'.$row.'" t="s"><v>'.($num+2).'</v></c><c r="D'.$row.'" t="s"><v>'.($num+3).'</v></c><c r="E'.$row.'" t="s"><v>'.($num+4).'</v></c></row>';
		}
		$maxCol = 'E'.$row;
		$fileStr = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
		$fileStr .= "\r\n".'<worksheet xml:space="preserve" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><outlinePr summaryBelow="1" summaryRight="1"/></sheetPr><dimension ref="A1:'.$maxCol.'"/><sheetViews><sheetView tabSelected="1" workbookViewId="0" showGridLines="true" showRowColHeaders="1"><selection activeCell="I2" sqref="I2"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="14.4" outlineLevelRow="0" outlineLevelCol="0"/><cols><col collapsed="false" hidden="false" max="5" min="1" style="0" width="20"/></cols><sheetData>'.$listStr.'</sheetData><sheetProtection sheet="false" objects="false" scenarios="false" formatCells="false" formatColumns="false" formatRows="false" insertColumns="false" insertRows="false" insertHyperlinks="false" deleteColumns="false" deleteRows="false" selectLockedCells="false" sort="false" autoFilter="false" pivotTables="false" selectUnlockedCells="false"/><printOptions gridLines="false" gridLinesSet="true"/><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/><pageSetup paperSize="1" orientation="default" scale="100" fitToHeight="1" fitToWidth="1"/><headerFooter differentOddEven="false" differentFirst="false" scaleWithDoc="true" alignWithMargins="true"><oddHeader></oddHeader><oddFooter></oddFooter><evenHeader></evenHeader><evenFooter></evenFooter><firstHeader></firstHeader><firstFooter></firstFooter></headerFooter></worksheet>';
		file_put_contents($fileStrPath, $fileStr);
	}

} // end class

?>
