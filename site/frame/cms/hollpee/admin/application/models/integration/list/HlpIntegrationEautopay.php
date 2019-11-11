<?php  

class HlpIntegrationEautopay extends HlpIntegrationBasic {

	public function execute($service, $user)
	{
		$params = array(
			'userProperty' => $user,
			'url' => $service['url']
		);
		$libsPath = HLP_ADMIN_FOLDER_PATH . '/application/models/integration/libs/e_autoplay/';
		$objView = new HlpView;
		$content = $objView->render('index.php', $params, $libsPath, '');

		echo $content;
		exit;
	}

} // end class

?>
