<?php  
class AdminController extends MainController {
	/**
	* id пользователя
	*/
	protected $user_id;

	function __construct()
	{
		$this->user_id = 1;

		parent::__construct();
	}

	protected function getUserId()
	{
		return $this->user_id;
	}

/**************************************************************************************/

}//end class

?>






