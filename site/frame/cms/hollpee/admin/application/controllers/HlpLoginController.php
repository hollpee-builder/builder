<?php  
/**
* Регистрация
*
*
*/
class HlpLoginController extends HlpMainController implements HlpIController {
	/**
	* Вход
	*
	*
	*/
	public function indexAction()
	{
		// $title = 'Вход в CMS';
		$title = '';
		$label = $title;			
		$this->showPage('login.php', $title, $label);
	}

	/**
	* Проверка - вход
	*
	*
	*/
	public function loginCheckAction()
	{
		$email = $this->getEmail();
		$password = HlpHash::getPassword($_POST['password']);

		$params = array('email'=>$email, 'password'=>$password);
		$hash = HlpDbAdmin::getInstance()->getHash($params);  

		if ($hash) {
			HlpAdmin::setCookie($hash);
			header('Location: ' . HlpUrl::attach('/'));
		} else {
			header('Location: ' . HlpUrl::attach('/login?error_email_password=1'));
		}
	}

	/**
	* Выход из account
	*
	*
	*/
	public function exitAccountAction()
	{
		//убираем куку 
		HlpAdmin::deleteCookie();
		// перенаправляем
		header("Location: ".HlpUrl::attach('/login'));
	}


	/**
	* Показывает страницу
	*
	*
	*/
	private function showPage($page, $title, $label, $params=array())
	{
		$content = '';
		$addClass = '';

		if ($page) $content = $this->objView->render('/login/'.$page, $params);
		else $addClass = ' noPage';

		$params = array(
			'content'=>$content, 
			'title'=>$title, 
			'label'=>$label,
			'addClass'=>$addClass
		);
		$result = $this->objView->render('/login/login_main.php', $params);

		$this->objFront->setBody($result);
	}

/***********************************************************************************************/

	/**
	* Регистрация
	*
	*/
	public function registerAction()
	{	
		$pathDbAdmin = HLP_ADMIN_FOLDER_PATH . '/data/db/admin.db';
		if (file_exists($pathDbAdmin)) {
			unlink($pathDbAdmin);
		}

		$page = 'register.php';
		$title = 'Создать администратора';
		$label = $title;
		$params = array();

		$this->showPage($page, $title, $label, $params);
	}

	/**
	* Проверка данных при регистрации
	*
	*
	*/
	public function registerCheckAction()
	{
		// добавляем новый профаил
		$email = $this->getEmail();
		$password = HlpHash::getPassword($_POST['password']);
		$hash = HlpHash::getNew($email.$password);
		$params = array('email'=>$email, 'password'=>$password, 'hash'=>$hash);		
		$newAdminId = HlpDbAdmin::getInstance()->addNewProfile($params);
		
		// на страницу выбора стиля
		if ($newAdminId) {
			//
			$cmsIndex = time();
			$cmsIndexFile = HLP_ADMIN_FOLDER_PATH.'/data/cms_index.txt'; 
			file_put_contents($cmsIndexFile, $cmsIndex);
			define('HLP_CMS_INDEX', $cmsIndex);

			// удаляем стандартные файлы
			HlpDir::remove(HLP_SITE_FOLDER_PATH.'/hlp_files');
			HlpDir::remove(HLP_SITE_FOLDER_PATH.'/hlp_upload_admin.php');
			HlpDir::remove(HLP_SITE_FOLDER_PATH.'/hollpee_upload_admin.php');
			HlpDir::remove(HLP_SITE_FOLDER_PATH.'/data/hollpee_site.xml');

			// станавливаем куку
			HlpAdmin::setCookie($hash);

			// перенаправляем на главную страницу
			header('Location: ' . HlpUrl::attach('/'));
		} else {
			header('Location: ' . $_SERVER['HTTP_REFERER']);
		}
	}

	/**
	* Отдает email
	*
	*
	*/
	private function getEmail()
	{
		return  HlpClear::email($_POST['email']);
	}
/***********************************************************************************************/

	/**
	* Ввод email
	*
	*
	*/
	public function restoryAction()
	{
		$title = 'Востановить пароль';
		$label = 'Введите ваш email для восстановления пароля';

		$this->showPage('restory.php', $title, $label);
	}


	/**
	* Отправка письма на почту с уникальной ссылкой
	*
	*
	*/
	public function restorySendAction()
	{
		$email = $_POST['email'];
		$params = array("email"=>$email);
		$dbAdmin = HlpDbAdmin::getInstance();

		// узнаем есть ли такой email
		$adminId = $dbAdmin->emailExists($params);

		// если есть email 
		if ($adminId) {
			//получаем ключ для востановления
			$key = $dbAdmin->getNewRestoryKey(array('profile_id'=>$adminId));
			//отправляем письмо на emial
			$this->sendRestoryMessage($email, $key);
		}

		// перенаправляем на страницу
		$url = HlpUrl::attach('/login/restorySendMsg?email='.$email);
		header('Location: ' . $url);
	}

	/**
	* Показывает текс что сообщение отправлено на email
	*
	*/
	public function restorySendMsgAction()
	{
		$email = $_GET['email'];
		// отдает страницу
		$title = 'Востановить пароль';
		$label = 'На email '.$email.' отправленно письмо с инструкцией по востановлению пароля. <br/>Срок действия письма 30 минут.';
		$this->showPage(false, $title, $label);
	}

	/**
	* Ввод нового пароля
	*
	*
	*/
	public function restoryNewAction()
	{
		$key = trim($_GET['key']);
		$dataKey = $this->getDataRestoryKey($key);

		// отдает страницу
		$title = 'Новый пароль';
		$label = 'Введите новый пароль';
		$params = array('key'=>$key);
		$this->showPage('restory_new.php', $title, $label, $params);
	}

	/**
	* Добавление нового пароля
	*
	*
	*/
	public function restoryAddNewAction()
	{
		// key
		$key = trim($_POST['key']);
		$dataKey = $this->getDataRestoryKey($key);

		// данные
		$email = $dataKey['email'];
		$psw = HlpHash::getPassword($_POST['password']);
		$hash = HlpHash::getNew($email.$psw);

		// меняем пароль
		$params = array('email'=>$email, 'password'=>$psw, 'hash'=>$hash);
		$res = HlpDbAdmin::getInstance()->updatePsw($params);

		// если не установился
		if (!$res) {
			header('Location: '.$_SERVER['HTTP_REFERER']);
			exit;
		}

		//сбрасываем ключ
		$profileId = $dataKey['profile_id'];
		$paramsReset = array('key'=>$key, 'profile_id'=>$profileId, 'is_restory'=>'yes');
		$isReset = HlpDbAdmin::getInstance()->resetRestoryKey($paramsReset);

		// ставим куку и перенаправляем
		HlpAdmin::setCookie($hash);

		// перенавпрявляем в admin
		header('Location: ' . HlpUrl::attach('/'));
	}

/*****************************************************************************************/
	/**
	* Отправить письмо на email для востановления пароля
	*
	* @see 	$this->restory_sendAction()
	*/
	private function sendRestoryMessage($email, $key)
	{
		$to = $email;
		$domain = $_SERVER['HTTP_HOST'];
		$subject = 'Восстановление пароля Hollpee';
		$message = $this->objView->render('/login/email_restory.php', array('key'=>$key));
		$headers = 'From: mail@'.$domain . "\r\n" .
				    'Reply-To: mail@'.$domain . "\r\n" .
				   	'Content-Type: text/html; charset=utf-8'. "\r\n" .
				    'X-Mailer: PHP/' . phpversion();

		mail($to, $subject, $message, $headers);
	}

	/**
	* Отдает данные ключа
	*
	* @see 	$this->restoryNewAction()
	* @see 	$this->restoryAddNewAction() 
	*/
	private function getDataRestoryKey($key)
	{
		// получаем информацию о ключе
		$params = array("key"=>$key);
		$dataKey = HlpDbAdmin::getInstance()->getDataRestoryKey($params);

		// если нету ключа или он не действительный
		if (!$dataKey) $this->error404();

		// добавляем email
		$params = array('profile_id'=>$dataKey['profile_id']);
		$dataKey['email'] =  HlpDbAdmin::getInstance()->getEmail($params);

		return $dataKey;
	}

/****************************************************************************************/

} //end class


