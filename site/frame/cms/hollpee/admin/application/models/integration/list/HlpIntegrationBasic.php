<?php  
abstract class HlpIntegrationBasic {
	protected $libsFolder = '';
	protected $listIncludeFile = array();

	public function __construct()
	{
		$this->includeFile();
	}

	public function execute($service, $lead) {}

	protected function getLibsRootPath()
	{
		return 'application/models/integration/libs';
	}

	protected function getLibsFolder()
	{
		return $this->libsFolder;
	}

	protected function getListIncludeFile()
	{
		return $this->listIncludeFile;
	}

	protected function getLibsPath()
	{
		$pathFolder = $this->getLibsRootPath();
		$libsFolder = $this->getLibsFolder();
		$libsPath = $pathFolder . '/' . $libsFolder;

		return $libsPath;
	}

	protected function includeFile()
	{
		$libsPath = $this->getLibsPath();
		$listIncludeFile = $this->getListIncludeFile();
		foreach ($listIncludeFile as $file) {
			require_once( $libsPath . '/' . $file );
		}
	}

} // end class

?>
