<?php 
/**
* Работа с папкой
*
*
*/
class HlpDir {
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

		if (empty($sftpObj)) rmdir($folder);
		else $sftpObj->rmdir($folder);
		
		closedir($dir);

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
			$pathOld = $folderOld ? $folderOld.'/'.$file : $file;
			$pathNew = $folderNew ? $folderNew.'/'.$file : $file;

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
		} else {
			$sftpObj->copy($pathOld, $pathNew);
		}
	}

	private static function removeFile($folder, $sftpObj=false)
	{
		if (empty($sftpObj)) unlink($folder);
		else $sftpObj->remove($folder);
	}
/************************************************************************************************/
	/**
	*
	* editor 
	* @see 	IndexController->saveImgAction()
	* @see 	IndexController->deleteImgAction()
	* account   	
	* @see 	LoginController->createFolderForNewUser()
	* @see 	ChoseStyleController->addStyleSiteAction()
	* @see 	IndexController->copySiteAction()
	* @see 	FormatPageLPF->upload()
	*/
	public static function copySftp($path)
	{
		self::sftp("copy", $path);
	}

	public static function removeSftp($path)
	{
		self::sftp("remove", $path);
	}

	private static function sftp($operationType, $path)
	{
		// return false;

		global $LIST_IP;
			
		$pathRoot = $_SERVER['DOCUMENT_ROOT'];	
		$pathNoRoot = preg_replace("@^".$pathRoot."@i", '', $path);

		$listProperty = array();
		preg_match_all("@^/user/([0-9]+)/([a-z0-9]+)/?@i", $pathNoRoot, $listProperty);

		$userId = $listProperty[1][0];
		$siteId = $listProperty[2][0];
		$pathFrom = $pathRoot.'/user/'.$userId.'/'.$siteId;
		$pathTo = $pathRoot.'/user/'.$userId.'/';	

		$curentCs = exec('uname -n');
		foreach($LIST_IP as $cs => $ip) {
			if (!$cs || $curentCs == $cs) continue;

			$deleteProperty = $operationType == "remove" ? '--delete' : '';
			$query = "rsync -rvzat --timeout=1 ".$deleteProperty." -e 'ssh -p ".SSH_PORT." -i/var/www/hollpee/public/.ssh/id_rsa' ".$pathFrom." holluser@".$cs.":".$pathTo;

			exec($query, $result);
		}
	}

/************************************************************************************************/

}//end class


?>

