<?php 
/**
* Лиды
*
*/
class HlpLeadController extends HlpAdminController implements HlpIController {
	/**
	* Отдает страницу
	*
	*/
	function indexAction()
	{
		$listPages = HlpSite::getListPage();

		if ($_GET && array_key_exists('page', $_GET)) $pageNum = HlpClear::number($_GET['page']);
		else $pageNum = 1;

		$pageId = array_key_exists('page_id', $_GET) ? $_GET['page_id'] : false;

		$leadData = HlpLead::getList($pageNum, $pageId);
		$leadData['listPages'] = $listPages;
		$leadData['currentPageId'] = $pageId;
		$count_lead = $leadData['count_lead'];
		
		$content = $this->objView->render('lead.php', $leadData);

		//сформировывкм страницу полностью
		$stylesheet = '	<link rel="stylesheet" href="'. HlpUrl::attach('/css/lead.css').'">
						<script type="text/javascript" src="'. HlpUrl::attach('/js/lead.js').'"> </script>
						';

		$params = array('content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>'Лиды <span class="contentTitleDesc">Количество: '.$count_lead.'</span>',
						'type'=>'lead');

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $params);
		$this->objFront->setBody($result);// вывод результата
	}


	/**
	* Изменяет примечание
	*
	* 
	*/
	public function editNoteAction()
	{
		$leadId = HlpClear::number($_POST['id']);
		$note = HlpClear::text($_POST['note']);

		$params = array('id' => $leadId, 'note' => $note);
		echo HlpHlpDbLead::getInstance()->editNote($params);
	}

	/**
	* Отмечает лид как прочитаный
	*
	*
	*/
	public function markLeadReadAction()
	{
		$leadId = HlpClear::number($_POST['id']);

		$params = array('id' => $leadId);
		echo HlpHlpDbLead::getInstance()->markLeadRead($params);
	}

/***********************************************************************************/
	
	/**
	* Экспорт
	*
	*
	*/
	public function exportAction()
	{
		$type = $_GET['type'];

		if ($type != 'vcf'
				&& $type != 'csv'
				&& $type != 'xlsx') {
			$type = 'xml';
		}

		$leadObj = new HlpLead();
		$content = $leadObj->export($type);

		$fileName = 'hlp_contacts.'.$type;
		$folderPath = HLP_ADMIN_FOLDER_PATH . '/data/down/file/';
		$filePath = $folderPath.$fileName;

		if ($type == 'xlsx') {
			$folderZipPath = $content;
			if (file_exists($filePath)) unlink($filePath);

			$zip = new HlpZip();
			$zip->ToZip($folderZipPath, $filePath, true);
			HlpDir::remove($folderZipPath);
		} else {
			file_put_contents($filePath, $content);
		}
		
		HlpFile::download($filePath);
	}

/***********************************************************************************/	

	/**
	*
	*
	*/
	public function detailAction()
	{
		$leadId = HlpClear::number($_GET['id']);
		$paramsLead = array('lead_id' => $leadId);

		if (array_key_exists('read', $_GET) && $_GET['read'] == 'no') {
			HlpDbLead::getInstance()->markLeadRead($paramsLead);
		}
		$lead = HlpDbLead::getInstance()->get($paramsLead);
		if (!$lead) $this->error404();

		// сайт
		//статусы
		$listStatus = HlpDbLead::getInstance()->getListStatusLead($paramsLead);
		if (!$listStatus) $listStatus = array();

		$lead['utm_name'] = '';

		$paramsDetail = array(
			'lead'=>$lead,
			'site'=>array(),
			'listStatus'=>$listStatus,
			'listStatusName'=>HlpLead::$listStatusName
		);

		$content = $this->objView->render('lead_detail.php', $paramsDetail);
		$stylesheet = '	<link rel="stylesheet" href="../css/lead_detail.css">
						<script type="text/javascript" src="../js/lead_detail.js"></script>';
			
		$title = $lead['email'];

		$param = array(	'content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>$title);

		$result = $this->objView->render('admin.php', $param);
		$this->objFront->setBody($result);
	}

	/**
	*
	*
	*
	*/
	public function editLeadDataAction()
	{
		$leadId = HlpClear::number($_POST['lead_id']);
		$newValue = HlpClear::text($_POST['value']);
		$dataType = HlpClear::text($_POST['type']);

		$params = array(
			'lead_id' => $leadId,
			'value' => $newValue
		);

		if ($dataType == 'email'
				|| $dataType == 'name'
				|| $dataType == 'phone'
				|| $dataType == 'addr'
				|| $dataType == 'price') {
			$res = HlpDbLead::getInstance()->editLeadProperty($params, $dataType);
		}

		echo true;
	}


	/**
	* Обновление статуса
	*
	*
	*/
	public function uploadStatusAction()
	{
		$leadId = HlpClear::number($_POST['lead_id']);
		$newStatus = HlpClear::text($_POST['status']);
		$statusComment = HlpClear::text($_POST['comment']);

		// добавляем статус
		$params = array(
			'lead_id' => $leadId,
			'status' => $newStatus,
			'note' => $statusComment
		);

		$res = HlpDbLead::getInstance()->addStatus($params);
		if (!$res) return false;

		// обновляем последний
		$params = array('lead_id' => $leadId, 'value' => $newStatus);
		$res = HlpDbLead::getInstance()->editLeadProperty($params, 'status');
		
		echo true;
	}

	/**
	* Удаление лида
	*
	*
	*/
	public function deleteAction()
	{
		$leadId = $_POST['lead_id'];
		$params = array('lead_id'=>$leadId);
		echo HlpDbLead::getInstance()->delete($params);
	}

	/**
	* Сброс статуса новый
	*
	*
	*/
	public function resetStatusNewAction()
	{
		$res = HlpDbLead::getInstance()->resetStatusNew();
		echo 1;
	}



}// end class 

?>
