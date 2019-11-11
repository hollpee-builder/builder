<?php 
/**
* Кабинет
*
*/
class HlpAccountController extends HlpAdminController implements HlpIController {
	/**
	* Отдает страницу
	*
	*/
	function indexAction()
	{
		$listCMSTypeStr = array(
			'start' => 'Старт',
			'bizness' => 'Бизнес',
			'marketer' => 'Маркетолог'
		);
		$cmsType = array_key_exists(CMS_TYPE, $listCMSTypeStr) ? $listCMSTypeStr[CMS_TYPE] : ''; 

		$profileInfo = HlpDbAdmin::getInstance()->getProfileInfo();
		$email = $profileInfo['email'];
		$organization = $profileInfo['organization'];
		$address = $profileInfo['address'];

		$params = array(
			'email' => $email,
			'organization' => $organization,
			'address' => $address,
			'cmsType' => $cmsType
		);
		$content =  $this->objView->render('account.php', $params);

		//сформировывкм страницу полностью
		$stylesheet = '	<link rel="stylesheet" href="'. HlpUrl::attach('/css/account.css').'">
						<script type="text/javascript" src="'. HlpUrl::attach('/js/account.js').'"> </script>
						';
		$titleContent = 'Кабинет';

		$params = array('content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>$titleContent,
						'type'=>'account');
		
		//сформировываем странцу
		$result = $this->objView->render('admin.php', $params);
		
		// вывод результата
		$this->objFront->setBody($result);
	}

/*******************************************************************************************/
	
	/**
	* Изменить пароль
	*
	*
	*/
	public function editPswAction()
	{
		$oldPsw = HlpHash::getPassword($_POST["old_psw"]); 
		$newPsw = HlpHash::getPassword($_POST["new_psw"]); 

		// изменяем пароль
		$params = array('profile_id'=>$this->adminId, 'old_psw'=>$oldPsw, 'new_psw'=>$newPsw);
		echo HlpDbAdmin::getInstance()->editPsw($params);
	}

	/**
	* Изменить email
	*
	*
	*/
	public function editPropertyAction()
	{
		$newValue = $_POST['value'];
		$property = $_POST['property'];
		$property = preg_replace('/[^\w]+/', '', $property);

		// изменяем пароль
		$params = array();
		$params[$property] = $newValue;
		echo HlpDbAdmin::getInstance()->editProfileProperty($params);
	}

/***********************************************************************************************/

}// end class 



?>






