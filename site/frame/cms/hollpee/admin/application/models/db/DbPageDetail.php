<?php 
/**
* 
* 
* @see 		
*/
class DbPageDetail extends Db {
	/**
	* @var 	string 	название бд
	*/
	protected $dbname = 'site';

	/**
	* Отдает abtest
	*
	* @see 	PageController::indexAction()
	*/
	public function getAbtest($params)
	{
		$rootPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $params['profile_id'] . '/' . $params['site_id'];
		$abtestJson = file_get_contents($rootPath.'/abtest.txt');

		return $abtestJson;
	}

	/**
	* Отдает abtest
	*
	* @see 	PageController::saveAbtestAction()
	*/
	public function saveAbtest($params, $type = 'admin')
	{
		$rootPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $params['profile_id'] . '/' . $params['site_id'];
		$abtestPath = $rootPath.'/abtest.txt';
		$newAbtestJson = trim($params['abtest']);
		if (!$newAbtestJson || $newAbtestJson == 'null') return false;

		$newAbtest = json_decode($newAbtestJson, true);
		if (!file_exists($abtestPath)) {
			file_put_contents($abtestPath, $newAbtestJson);
			return true;
		}

		$oldAbtestJson = file_get_contents($abtestPath);
		$oldAbtest = json_decode($oldAbtestJson, true);
		
		// сохранение в админ
		if ($type == 'admin') {
			foreach ($oldAbtest as $abId => $abItem) {
				// была добавлена страница в редакторе
				if (!$newAbtest[$abId]) {
					$newAbtest[$abId] = $abItem;
				}
			}

			foreach ($newAbtest as $abId => $abItem) {
				// была удалена страница
				if (!$oldAbtest[$abId]) {
					unset($newAbtest[$abId]);
				}
			}
		// сохранение в редакторе
		} else {
			foreach ($newAbtest as $abId => $abItem) {
				// берем старые настройки, что бы в редакторе они не перезаписались
				if ($oldAbtest[$abId]) {
					$newAbtest[$abId] = $oldAbtest[$abId];
				}
			}
		}
		
		$newAbtestJson = json_encode($newAbtest, true);
		file_put_contents($abtestPath, $newAbtestJson);
	}

	/**
	* Отдает abtest
	*
	* @see 	PageController::saveAdaptiveTitleAction()
	*/
	public function setStatusAbtestUpdateSetting($params)
	{
		$sql = "UPDATE site 
					SET abtest_update_new_setting = :abtest_update_new_setting
					WHERE id = :site_id
						AND profile_id = :profile_id";
		return $this->dataManipulation($sql, $params);
	}

	/**
	* Отдает abtest
	*
	* @see 	PageController::indexAction()
	*/
	public function getStatusAbtestUpdateSetting($params)
	{
		$sql = "SELECT abtest_update_new_setting 
					FROM site
					WHERE profile_id = :profile_id
						AND id = :site_id
						AND date_delete IS NULL";
		$res = $this->getSample($sql, $params);
		if ($res) return $res[0]['abtest_update_new_setting'];
	}

/*******************************************************************************/
/*******************************************************************************/




/*******************************************************************************/

} // end class

?>
