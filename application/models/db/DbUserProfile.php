<?php 
/**
* Запрос к БД - профаил пользователя
*
*
* 
*/
class DbUserProfile extends Db {

	/**
	* Отдает данные пользователя
	*
	* @see 	IndexController->indexAction() - (editor)
	* @see 	IndexController->showSiteAction() - (editor)
	* @see 	IndexController->editPageImage - (account)
	* @see 	FormatPageLPF->addInDBImg()
	* @see 	$this->getFont()
	*/
	public function getData($params)
	{	
		$userDataPath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$params['profile_id'].'/user_data.txt';
		if (file_exists($userDataPath)) {
			$res = array();
			$res[0] = array();
			$res[0]['data'] = file_get_contents($userDataPath);

			return $res;
		} else {
			$sql = "SELECT data
						FROM user_profile 
						WHERE id =:profile_id";
			return $this->select($sql, $params);
		}
	}


	/**
	* Сохраняем данные пользователя
	*
	* @see 	IndexController->saveAction() - (editor)
	* @see 	IndexController->editPageImage - (account)
	*/
	public function saveData($params)
	{
		$userDataPath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$params['profile_id'].'/user_data.txt';
		file_put_contents($userDataPath, $params['data']);
		// записываем его данные
		$userInfoPath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$params['profile_id'].'/user_info.txt';
		if (!file_exists($userInfoPath)) {
			$userInfo = array();
			$userInfo['email'] = 'test@test.com';
			$userInfoJson = json_encode($userInfo, true);
			file_put_contents($userInfoPath, $userInfoJson);
		}

		/*** временно ********/
		$params['data'] = NULL;
		$sql = "UPDATE user_profile
					SET data = :data 
					WHERE id =:profile_id";
		$this->manipulation($sql, $params);
		/************************/

		return true;
	}

	/**
	* Отдает шрифты пользователя
	*
	* @see 	IndexController->showSiteAction() - editor
	*/
	public function getFont($params)
	{
		$userData = DbUserProfile::getInstance()->getData($params);
		$userData = json_decode($userData[0]["data"], true);

		return $userData["font"];
	}

/***********************************************************************************/
	/**
	* Отдает шаблоны
	* 
	* @see 	EditorController::saveNewTemplate()
	* @see 	EditorController::deleteTemplateAction()
	*/
	public function getTemplate($params)
	{
		$sql = "SELECT template
					FROM user_profile 
					WHERE id =:profile_id";
		$res = $this->select($sql, $params);
		
		if ($res) return $res[0]['template'];
		else return false;
	}

	/**
	* Сохраняет шаблоны
	* 
	* @see 	EditorController::saveNewTemplate()
	* @see 	EditorController::deleteTemplateAction()
	*/
	public function saveTemplate($params)
	{
		$sql = "UPDATE user_profile 
					SET template=:template
					WHERE id=:profile_id";
		return $this->manipulation($sql, $params);
	}
/******************************************************************************************/

} //end class


?>
