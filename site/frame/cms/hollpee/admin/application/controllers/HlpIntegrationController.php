<?php 
/**
* Интеграция
*
*/
class HlpIntegrationController extends HlpAdminController implements HlpIController {
	/**
	* Отдает страницу
	*
	*/
	function indexAction()
	{
		$listIntegrationApi = HlpIntegration::$listIntegrationApi;
		$listIntegrationApiValue = HlpIntegration::getListIntegrationApiValue();
		$listPages = HlpSite::getListPage();

		$paramsPage = array(
			'list_integration_api'=> json_encode($listIntegrationApi, true),
			'list_integration_api_value'=> json_encode($listIntegrationApiValue, true),
			'list_pages' => json_encode($listPages, true),
			);
		$content = $this->objView->render('integration.php', $paramsPage);

		//сформировывкм страницу полностью
		$stylesheet = '	<link rel="stylesheet" href="'. HlpUrl::attach('/css/integration.css').'">
						<script type="text/javascript" src="'. HlpUrl::attach('/js/main/file.js').'"> </script>
						<script type="text/javascript" src="'. HlpUrl::attach('/js/integration.js').'"> </script>
						';

		$params = array('content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>'Интеграции',
						'type'=>'integration');

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $params);
		$this->objFront->setBody($result);// вывод результата
	}

/**********************************************************************************/
	public function uploadNewApiAction()
	{
		$fileObj = new HlpFile();
		$fileName = $fileObj->save('holllpee_new_plagin.zip', $_POST['content'], '');
		$integrationsPath = HLP_ADMIN_FOLDER_PATH . '/integrations/';// . $fileName;
		$filePath = HLP_SITE_FOLDER_PATH . '/' . $fileName;

		$zip = new ZipArchive;
		if ($zip->open($filePath) === TRUE) {
		    $zip->extractTo($integrationsPath);
		    $zip->close();
		} else {
		    exit;
		}
		unlink($filePath);

		echo $fileName;
	}

	/**
	* Удаление интеграции
	*
	*
	*/
	public function deleteApiAction()
	{
		$service = $_POST['service'];
		$pathIntegration = HLP_ADMIN_FOLDER_PATH . '/integrations/' . $service;
		HlpDir::remove($pathIntegration);

		echo true;
	}

	/**
	* Сохранение интеграции
	*
	*
	*/
	public function saveApiAction()
	{
		$json = $_POST['property'];
		HlpIntegration::saveValue($json);
		echo 1;
	}

/**************************************************************************************/


} // end class
