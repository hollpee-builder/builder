<?php 
/**
* Работа с папкой
*
*
*/
class Dir {
	/**
	* Удаляет папку
	*
	*
	*/
	public static function remove($folder, $sftpObj=false)
	{
		if (!file_exists($folder)) return false;
		
		// если фаил
		if (is_file($folder)) {
			self::removeFile($folder, $sftpObj);
			return false;
		} 

		$dir = opendir($folder);
		if (!$dir) return false;

		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..') continue;
			$path = $folder.'/'.$file;
			if (is_dir($path)) self::remove($path, $sftpObj);
			else self::removeFile($path, $sftpObj);
		}

		closedir($dir);
		
		if (empty($sftpObj)) rmdir($folder);
		else $sftpObj->rmdir($folder);

		return true;
	}

	/**
	* Копирует папку
	*
	*
	*/
	public static function copy($folderOld, $folderNew, $noSelfFolder=false, $sftpObj=false)
	{
		if (!file_exists($folderOld)) return false;

		// если фаил
		if (is_file($folderOld)) {
			self::copyFile($folderOld, $folderNew, $sftpObj);
			return false;
		} else if (!file_exists($folderNew)) {
			mkdir($folderNew); 
		} else if (!empty($sftpObj)) {
			$sftpObj->mkdir($folderNew);
		}

		$dir = opendir($folderOld);
		if (!$dir) return false;

		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..') continue;
			$pathOld = $folderOld.'/'.$file;
			$pathNew = $folderNew.'/'.$file;

			if (is_dir($pathOld)) {
				self::copy($pathOld, $pathNew, $noSelfFolder, $sftpObj);
			} else {
				self::copyFile($pathOld, $pathNew, $sftpObj);
			}
		}
		
		closedir($dir);

		return true;
	}


	private static function copyFile($pathOld, $pathNew, $sftpObj=false)
	{
		if (empty($sftpObj)) {
			if (file_exists($pathNew)) unlink($pathNew);
			copy($pathOld, $pathNew);
			// if (!file_exists($pathNew)) copy($pathOld, $pathNew);
		}
		// else echo $sftpObj->copy($pathOld, $pathNew).'='.$pathOld.'</br>';
		else $sftpObj->copy($pathOld, $pathNew);
	}

	private static function removeFile($folder, $sftpObj=false)
	{
		if (empty($sftpObj)) unlink($folder);
		else $sftpObj->remove($folder);
	}

/************************************************************************************************/
	/**
	* Скопировать только директории
	*
	*
	*/
	public static function copyOnlyDir($folderOld, $folderNew)
	{
		if (!file_exists($folderOld)) return false;

		// если фаил
		if (is_file($folderOld)) return false;
		else if (!file_exists($folderNew)) mkdir($folderNew); 

		$dir = opendir($folderOld);
		if (!$dir) return false;

		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..') continue;
			$pathOld = $folderOld.'/'.$file;
			$pathNew = $folderNew.'/'.$file;

			if (is_dir($pathOld)) {
				self::copyOnlyDir($pathOld, $pathNew, $noSelfFolder);
			}
		}
		
		closedir($dir);

		return true;
	}

	/**
	* Удаляет пустые директории
	*
	*/
	public static function removeOnlyDirEmpty($folder)
	{
		if (!file_exists($folder)) return false;
		else if (is_file($folder)) return false;

		$isExistsFile = false;
		
		$dir = opendir($folder);
		if (!$dir) return false;
		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..') continue;
			$path = $folder.'/'.$file;
			if (is_dir($path)) self::removeOnlyDirEmpty($path);
			else $isExistsFile = true;
		}
		closedir($dir);

		// если в директории нет файлов
		if (!$isExistsFile) rmdir($folder);

		return true;
	}

/************************************************************************************************/

}//end class


?>

