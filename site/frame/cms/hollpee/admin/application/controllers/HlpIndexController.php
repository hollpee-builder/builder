<?php  
/**
* Сайт
*
*
*
*/
class HlpIndexController extends HlpAdminController implements HlpIController {
	/**
	* Отдает страницу
	*
	*/
	public function indexAction()
	{	
		$objSite = new HlpSite();
		$objSite->removeFileUploadAdmin();
		
		$listSites = HlpSite::getListPage(true, true);
		$params = array('listSites' => $listSites);

		$content =  $this->objView->render('site.php', $params);

		//сформировывкм страницу полностью
		$stylesheet = '	<link rel="stylesheet" href="'. HlpUrl::attach('/css/site.css').'">
						<script type="text/javascript" src="'. HlpUrl::attach('/js/site.js').'"> </script>
						<script type="text/javascript" src="'. HlpUrl::attach('/js/main/file.js').'"> </script>
						';

		$params = array('content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>'Сайт',
						'titleDesc'=>'Список всех страниц',
						'type'=>'site');

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $params);
		
		// вывод результата
		$this->objFront->setBody($result);
	}

/***********************************************************************************************/
	
	/**
	* Изменить имя файла
	*
	*
	*/
	public function editPageNameAction()
	{
		$pageId = $_POST['page_id'];
		$newName = $_POST['new'];
		
		$siteObj = new HlpSite();
		echo $siteObj->editPageName($pageId, $newName);
	}

	/**
	* Удаление страницы
	*
	*
	*/
	public function deletePageAction()
	{
		// удаляем
		$siteObj = new HlpSite();
		$res = $siteObj->deletePage($_POST['id']);
		
		echo 1;
	}

	/**
	* Загрузка шаблона
	*
	*
	*/
	public function uploadTemplateAction()
	{
		$fileName = $_POST['name'];
		$fileContent = $_POST['content'];

		$siteObj = new HlpSite();
		echo $siteObj->uploadTemplate($fileName, $fileContent);
	}

/************************************************************************************/

} // end class

?>

