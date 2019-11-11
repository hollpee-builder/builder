<?php  
abstract class HlpDb {
	protected $connection;

	static protected $_instances = array();

	/**
	* @var 	string 	название базы данных
	*/
	protected $dbname;

	private function __construct($adminPath = false)
	{
		try {
			if (!$adminPath) $adminPath = HLP_ADMIN_FOLDER_PATH;
			$dbPath = $adminPath . '/data/db/' . $this->dbname;
			$this->connection = new SQLite3($dbPath);
		} catch (Exception $e) {

		}
	}

	static public function getInstance($adminPath = false)
	{
		$class = get_called_class();
		if (!isset(self::$_instances[$class])) self::$_instances[$class] = new $class($adminPath);
		
		return self::$_instances[$class];
	}

	/**
	* манипуляция с данными(insert, delete, update)
	*
	*
	*/
	protected function manipulation($sql, $params=array())
	{	
		$res = $this->query($sql, $params);
		return count($res); 
	}

	/**
	* Вставка элемента
	*
	*/
	protected function insert($sql, $params=array())
	{
		$result = $this->query($sql, $params);
		return  $result ? $this->connection->lastInsertRowID() : false;
	}

	/**
	* Выборка элемента
	*
	*
	*/
	protected function select($sql, $params = array())
	{
		// запрос
		$result = $this->query($sql, $params);

		// формирует список
		$list = array();
		while ($row = $result->fetchArray(SQLITE3_ASSOC)) $list[] = $row;

		if (!empty($list)) return $list;
		return false;
	}

	/**
	* Запрос
	*
	* @see 	$this->manipulation()
	* @see 	$this->select()
	* @see 	$this->insert()
	*/
	private function query($sql, $params = array())
	{
		if (!$this->connection) return false;
		
		// подготавливаем запрос
		$statement = @$this->connection->prepare($sql);
		if (!$statement) return false;
		
		// параметры
		if ($params) {
			foreach ($params as $key => $value) {
				$statement->bindValue(':'.$key, $value);
			}
		}

		// выполняем запрос
		return $statement->execute();
	}

/****************************************************************************************/
	/**
	* Узнает существует таблица или нет
	*
	*/
	protected function isExistsTable($tableName)
	{
		$sql = "SELECT name 
					FROM sqlite_master 
					WHERE type='table' AND name='".$tableName."';";
		return $this->select($sql);
	}

/**********************************************************************************************/

	/**
	* Начало транзакции
	*
	*/
	protected function startTransaction()
	{
		return $this->dataManipulation("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; START TRANSACTION;");
	}

	protected function commit()
	{
		$this->dataManipulation("COMMIT");
	}

	protected function rollback()
	{
		$this->dataManipulation("ROLLBACK");
	}


}// end class

?>
