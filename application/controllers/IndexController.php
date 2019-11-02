<?php 
class IndexController extends MainController implements IController {

	public function indexAction()
	{	
		header('Location: /sites2');
		exit;
	}
}
