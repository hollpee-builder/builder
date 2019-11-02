<?php  
/**
*
*
*
*/
class HlpDbUpdate extends HlpDb {
	private $adminPath;
	protected $dbname = 'admin';

	private $listNewColumn = array(
		array(
			"db" => "admin",
			"table" => "profile",
			"list_column" => array(
				"organization TEXT NULL",
				"address TEXT NULL"
			)
		),
		array(
			"db" => "constructor",
			"table" => "lead",
			"list_column" => array(
				"utm_source TEXT NULL",
			)
		),

		array(
			"db" => "analytics",
			"table" => "visit",
			"list_column" => array(
				"utm_source TEXT NULL",
			)
		),
	);

	private function setAdminPath($adminPath)
	{
		$this->adminPath = $adminPath;
	}

	private function getAdminPath()
	{
		return $this->adminPath;
	}

	private function getFolderDbPath()
	{
		$adminPath = $this->getAdminPath();
		$folderPath = $adminPath . '/data/db';
		return $folderPath;
	}

	private function getListNewColumn()
	{
		return $this->listNewColumn;
	}

/****************************************************************************/
	
	public function execute($adminPath)
	{
		$this->setAdminPath($adminPath);
		$folderDbAdmin = $this->getFolderDbPath();
		$listNewColumn = $this->getListNewColumn();

		foreach ($listNewColumn as $colGroup) {
			$db = $colGroup['db'];
			$dbPath = $folderDbAdmin . '/' . $db . '.db';
			$this->connection = new SQLite3($dbPath);

			$table = $colGroup['table'];
			$listCol = $colGroup['list_column'];
			foreach($listCol as $col) {
				$sql = "ALTER TABLE ".$table." ADD COLUMN " . $col;
				$this->manipulation($sql);
			}
		}
	}


/****************************************************************************/

} // end class

?>
