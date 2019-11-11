<?php  
/**
* 
*
*
*/
class HlpEditorController extends HlpAdminController implements HlpIController {

	/**
	* Сохранение сайта
	*
	*
	*/
	public function saveAction()
	{	
		$pageId = $_POST['page_id'];
		$siteId = $_POST['site_id'];

		$objDataXML = new HlpDataXML();
		$customizerPage = $_POST['customizer_page'];
		if ($customizerPage) {
			$customizerPage = json_decode($customizerPage, true);
			$objDataXML->saveCustomizer($pageId, $customizerPage);
		}

		$customizerMain = $_POST['customizer_main'];
		if ($customizerMain) {
			$customizerMain = json_decode($customizerMain, true);
			$objDataXML->saveCustomizer($siteId.'_main', $customizerMain);
		}

		echo true;
	}

	private function replaceTagScript($text)
	{
		return preg_replace('/hlp_hlp_scr_hlp_hlp/', 'script', $text);
	}

/*******************************************************************************/

	/**
	* Добавляет новое изображение
	*
	*
	*/
	public function addFileAction()
	{
		$fileName = $_POST['name'];
		$fileContent = $_POST['content'];
		$fileType = $_POST['type'];
		
		$fileFolderPath = '/' . $fileType;
		$folder = $_POST['folder'];
		if ($folder && $fileType == 'images') {
			$fileFolderPath = $fileFolderPath . '/' . $folder;
		}

		$fileObj = new HlpFile();
		$newFileName = $fileObj->save($fileName, $fileContent, $fileFolderPath);
		if ($newFileName) {
			$parentId = preg_replace('/^[0-9]+/', '', $folder);
			$newFileName = preg_replace("/^\//", '', $newFileName);

			$nameRes = array();
			preg_match_all('/[^\/]+$/', $newFileName, $nameRes);
			$name = $nameRes[0][0];

			$imgProperty = array(
				'name' => $name,
				'src' => $newFileName,
				'parent_id' => $parentId,
				'type' => $fileType
			);

			echo json_encode($imgProperty, true);
		}
	}

	/**
	* Удаление изображения
	*
	*
	*/
	public function deleteFileAction()
	{
		$fileName = $_POST['name'];
		$fileType = $_POST['type'];
		$filePath = HLP_SITE_FOLDER_PATH . '/' . $fileType . '/' . $fileName;
		
		if(!file_exists($filePath)) return false;

		echo unlink($filePath);
	}

/*******************************************************************************/

} // end class

?>
