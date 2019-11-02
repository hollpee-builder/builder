<?php 
/**
* Добавление новой страницы
*
*
*/
class CmsController extends AdminController implements IController {
	/**
	* Контроллер отдает страницу
	*
	*/
	function indexAction()
	{	
		$objCms = new Cms();
		$logoSrc = $objCms->getLogoSrc($this->user_id);
		$paramsPage = array(
			'logoSrc' => $logoSrc
		);

		$content = $this->objView->render('cms.php', $paramsPage);
		$stylesheet = '	<link rel="stylesheet" href="'.Url::get('/css/cms.css').'">
						<script type="text/javascript" src="'.Url::get('/js/main/modal.js').'"> </script>
						<script type="text/javascript" src="'.Url::get('/js/main/file.js').'"> </script>
						<script type="text/javascript" src="'.Url::get('/js/cms.js').'"> </script>';
		$titleContent = Resource::$page_cms_title;
		
		$param = array(	'content'=>$content, 
						'stylesheet'=>$stylesheet,
						'titleContent'=>$titleContent);

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $param);
		$result .= "<script> $('.navCms').attr('chosen', 'true');</script>";

		$this->objFront->setBody($result);
	}

	public function logoUploadAction()
	{
		$logoType = $_POST['site_id'];
		$objCms = new Cms();

		$res = $objCms->logoUpload($this->user_id, $logoType);
		if (!$res) return false;

		$logoSrc = $objCms->getLogoSrc($this->user_id);
		echo json_encode($logoSrc);
	}

	public function logoDeleteAction()
	{
		$logoType = $_POST['type'];
		$objCms = new Cms();

		$res = $objCms->deleteUpload($this->user_id, $logoType);
		if (!$res) return false;

		$logoSrc = $objCms->getLogoSrc($this->user_id);
		echo json_encode($logoSrc);
	}

} // end class

?>
