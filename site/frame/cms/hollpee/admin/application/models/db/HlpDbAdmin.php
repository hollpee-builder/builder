<?php  
/**
*
*
*
*/
class HlpDbAdmin extends HlpDb {
	protected $dbname = 'admin.db';

	/**
	* Существует bd или нет
	*
	* 
	* @see 	MainController::__construct()
	*/
	public function isExistsProfile()
	{
		$sql = "SELECT * FROM profile";
		return $this->select($sql);
	}

	/**
	* Создает таблицу
	*
	* @see 	HlpDbInit::create()	
	*/
	public function createTable()
	{
		$sql = "CREATE TABLE profile (
					id INTEGER PRIMARY KEY, 
					name NULL, 
					email NOT NULL, 
					password NOT NULL,
					organization TEXT NULL,
					address TEXT NULL, 
					hash NOT NULL)";
		$res = $this->manipulation($sql);
		
		$sql = "CREATE TABLE restory (
					id INT PRIMARY KEY,
					profile_id INT NOT NULL,
					unique_key TEXT NOT NULL,
					is_restory TEXT NULL,
					date_create TEXT NOT NULL,
					date_restory TEXT NULL)";
		return $this->manipulation($sql);
		
	}
/*********************************************************************************************/	

	/**
	* Добавляет нового пользователя
	*
	* @see 	LoginController::registerCheckAction()
	*/
	public function addNewProfile($params)
	{	
		$sql = "INSERT INTO profile(email, password, hash) 
					VALUES(:email, :password, :hash)";
		return $this->insert($sql, $params);
	}


	/**
	* Отдает id админа
	*
	* @see 	AdminController::checkAuthorized()
	*/
	public function getId($params)
	{
		$sql = "SELECT id FROM profile WHERE hash = :hash";
		$result = $this->select($sql, $params);

		if ($result) return $result[0]['id'];
		else return false;
	}

	/**
	* Вход
	*
	* @see 	LoginController::loginCheckAction()
	*/
	public function getHash($params)
	{
		$sql = "SELECT hash FROM profile 
					WHERE email = :email
						AND password = :password";

		$result = $this->select($sql, $params);
		
		if ($result) return $result[0]["hash"]; 
		else $result;
	}

	/**
	* Отдает email
	*
	* @see 	HlpLead::sendEmail()
	*/
	public function getEmail()
	{
		$sql = "SELECT email FROM profile";
		$result = $this->select($sql);
		
		if ($result) return $result[0]["email"];
		else return false;
	}

	/**
	* Отдает информацию о профайле
	*
	* @see 	AccountController::indexAction()
	*/
	public function getProfileInfo()
	{
		$sql = "SELECT email, organization, address FROM profile";
		$result = $this->select($sql);
		return $result ? $result[0] : false;
	}

	/**
	* Узнает есть ли такой email
	*
	* @see 	LoginController::restorySendAction()	
	*/
	public function emailExists($params)
	{	
		$sql = "SELECT id FROM profile WHERE email = :email";
		$result = $this->select($sql, $params);
		
		if ($result) return $result[0]["id"]; 
		else return false;
	}

	/**
	* Изменяет пароль
	*
	* @see 	AccountController::editPswAction()
	*/
	public function editPsw($params)
	{
		$sql = "UPDATE profile SET password = :new_psw
					WHERE id = :profile_id
						AND password = :old_psw";
		return $this->manipulation($sql, $params);
	}

	/**
	* Изменяет email
	*
	* @see 	AccountController::editEmailAction()
	*/
	public function editProfileProperty($params)
	{
		$property = array_keys($params);
		$property = $property[0];
		$sql = "UPDATE profile SET ".$property." = :".$property;
		return $this->manipulation($sql, $params);
	}

/*********************************************************************************/
		
	/**
	* Отдает новый ключ для востановления пароля
	*
	* @see 	LoginController::restorySendAction()
	*/
	public function getNewRestoryKey($params)
	{
		// обнуляем все предыдущие
		$paramsReset = $params;
		$paramsReset['is_restory'] = 'no';
		$paramsReset['key'] = '';
		$this->resetRestoryKey($paramsReset);

		// создаем ключ
		$newKey = HlpHash::getNew($params['profile_id']);
		$params['key'] = $newKey;

		// добавляем новый номер
		$sql = "INSERT INTO restory(unique_key, profile_id, date_create) 
						VALUES(:key, :profile_id, strftime('%s', 'now', 'localtime'))";
		$res = $this->manipulation($sql, $params);
		return $newKey;
	}

	/**
	* Сбрасывает ключи востановления 
	*
	* @see 	$this->getNewRestoryKey()
	*/
	public function resetRestoryKey($params)
	{
		$sql = "UPDATE restory 
					SET date_restory = strftime('%s', 'now', 'localtime'), is_restory=:is_restory
					WHERE unique_key=:key OR profile_id=:profile_id";
		return $this->manipulation($sql, $params);
	}


	/**
	* Отдает данные о ключе
	*
	* @see 	LoginController::getDataRestoryKey()
	*/
	public function getDataRestoryKey($params)
	{
		$sql = "SELECT profile_id, 
					strftime('%s', 'now', 'localtime') - date_create AS time_age
				FROM restory
				WHERE unique_key = :key
					AND date_restory IS NULL";
		$keyData = $this->select($sql, $params);
		
		//если выдан больше чем 30 минут назад 
		if ($keyData[0]['time_age'] > 2400) return array();
		
		// отдаем данные
		return $keyData[0];
	}

	/**
	* обновляет пароль
	*
	* @see LoginControler::restoryAddNewAction()
	*/
	public function updatePsw($params)
	{	
		// обновляем пароль
		$sql = "UPDATE profile 
					SET password=:password, hash = :hash
					WHERE email=:email";
		return $this->manipulation($sql, $params);
	}

} // end class

?>
