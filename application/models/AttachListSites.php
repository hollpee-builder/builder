<?php
/**
* Сформировывает страницу - список страниц пользователя определенной группы
*
* @see /application/controller/IndexController.php
* @url 	/pages
*/ 
class AttachListSites {
	/**
	* @var 	int 	индификатор пользователя 	
	*/
	protected $userId;

	/**
	* @var 	int 	индификатор группы страниц	
	*/
	protected $projectId;
	

	/**
	* Конструктор
	* Устанавливаем в переменные 
	* 
	* @uses 	this::userId 		устанавливаем значение 
	* @uses 	this::groupId 		устанавливаем значение 
	*/
	function __construct($userId, $projectId)
	{
		//id пользователя
		$this->userId = $userId;
		//id  проекта
		$this->projectId = $projectId;
	}
/*******************************************************************************************/
	/**
	* Функция оболочка, входная точка, получить сформированный html страницы
	* 	
	* @return 	html 	сформированая страница - список страниц определенной группы 
	*
	* @uses this::getListProjects()		получаем html блок со списком групп и количеством страниц в них
	* @uses this::getSetItemNavGroup() 	отмечает текущий пункт навигации по группам как активный
	*/
	public function get()
	{
		//получаем html блок со списком проектов
		$listProject = $this->getListProjects();  		
		//список сайтов
		$listSites = $this->listSites();
		
		// количество сайтов которое можно добавить
		$paramsRate = array('profile_id'=>$this->userId);

		$arrSites = array(
						'userId' => $this->userId,
						'listSites' => $listSites,
						'listProject'=> $listProject,
						'selectedProject'=>$this->projectId,
						); 
		//получаем страницу Sites
		$result = View::render('sites.php', $arrSites);

		return array('content'=>$result, 'listSites'=>$listSites);
	}
/**********************************************************************************************/
/**********************************************************************************************/
	/**
	* Отдает html блок - список групп с колическтво страниц в них
	*
	* @return 	html 	сформированая часть страницы - список групп 
	* 					с количеством страниц в каждой группе
	*
	* @uses DbGroupPages:getListProject()	/application/modal/db/DbGroupPages.php 	получить список групп пользователя
	* @uses this::getListCountSites() 	получить список количества страниц по группам
	* @uses this::attachBlockGroups() 	формирует html блок списка групп
	* @see 	this::get()	
	*/
	private function getListProjects()
	{
		//список групп
		$arrListProjects = DbSite::getInstance()->getListProject(array("profile_id"=>$this->userId));	
		// количество страниц в группе
		$arrCountSites = $this->getListCountSites();

		// формируем массив
		$totalCountPages = 0;
		$count = 0;
		$listProject = array();
		foreach ($arrListProjects as $index => $project) {
			$projectId = $project['project_id'];
			
			// добавляем количество страниц в массив
			if ($projectId) $count = @$arrCountSites[$projectId];
			else $count = 0;
			
			$project['count'] = $count ? $count : 0;
			$listProject[$index] = $project;
			// добавляем к общему количеству
			$totalCountPages += $count;
		}

		// сформировать html block
		return array('list_project'=>$listProject, 'total_count'=>$totalCountPages);	
	}

	/**
	* Отдает список - количество страниц по группам
	*
	* @return 	array количество страниц по группам
	*
	* @uses 	DbPage:getCountSitesInProject()	/application/modal/db/DbPage.php 	получить количество страниц в каждой группе
	* @uses 	this::userId 		в функциях DbPage::getCountSitesInProject() как параметр
	* @see 		this::getBlockProject()
	*/
	function getListCountSites()
	{
		$params = array('profile_id'=>$this->userId);
		//количество страниц в каждом проекте
		$arrCountSites = DbSite::getInstance()->getCountSitesInProject($params);


		//приводим массив в нужный вид
		$res = array();
		foreach ($arrCountSites as $key) {
			$res[$key['project_id']] = $key['count'];
		}
		
		return $res;
	}
/*************************************************************************************************/
/*********************************************************************************************/
	/**
	* Отдает список сайтов
	*
	* @see  $this->get() 
	*/
	private function listSites()
	{
		// получаем список сайтов
		$params = array('profile_id'=>$this->userId);
		// $projectId
		$listSites = DbSite::getInstance()->getListSitesUser($params, $this->projectId);
		
		// добавляем туда картинки
		foreach ($listSites as $index => $site) {
			$site['img'] = Image::getImgStyle($this->userId, $site['id']);
			$listSites[$index] = $site;
		}
		return $listSites;
	}
/******************************************************************************************/

}//end class

















