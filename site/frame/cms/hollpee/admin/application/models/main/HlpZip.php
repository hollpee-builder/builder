<?php  

class HlpZip extends ZipArchive {

	var $lPrefix; 
	
	function ToZip ($source, $destination, $noRootFolder = false){
		$result = false;
		// Получаем директорию исходного каталога или файла
		$dir = pathinfo($destination, PATHINFO_DIRNAME);
		
		// Создаем если необходимо директории для будущего архива
		if (@!file_exists($dir)) {
			if (!mkdir($dir, 0777, true))
				return false;
		}		
		
		// Проверяем существование директории для будущего архива		
		if (@file_exists($dir)) {
			if ($this->open($destination, ZIPARCHIVE::CREATE)) {
								
				/*	
				*	Получаем длину пути исходной директории с
				*	прибавленным одним слешем
				*/
				
				if ($noRootFolder) {
					$this->lPrefix = strlen($source . '/');
				} else {
					$this->lPrefix = strlen(pathinfo($source, PATHINFO_DIRNAME) . '/');
				}

				if (is_dir($source)) {
					/*	
					*	Если файл является директорией, то создаем
					*	структуру каталогов и файлов в будущем архиве
					*/
					
					$this->PackingDirectory($source);
					$result	= true;				
				} else if (is_file($source) && @file_exists($source)) {
					/*	
					*	Если файл является не директорией и существует, то
					*	добавляем его сразу в архив
					*/
					
					$this->addFile($source, pathinfo($source,
													  PATHINFO_BASENAME));
					$result	= true;
				}
				$this->close();
				
			}
		}
		return $result;
	}
	
	function PackingDirectory ($source){
		// Получаем дескриптор обходимого каталога
		$handle = @opendir($source);

		/*	
		*	Совершаем рекурсивный обход всех вложенных
		*	директорий
		*/
		
		while (false !== $node = readdir($handle)) {
			if ($node != '.' && $node != '..') {
				// Полный путь файла, плюс имя узла
				$fPath = "$source/$node";
				
				/*	
				*	Локальный путь файла 
				*	(от исходного каталога)
				*/
				
				$lPath = substr($fPath, $this->lPrefix);
				if (is_dir($fPath)){
				
					/*	
					*	Если файл является каталогом, то 
					*	добавляем в архив категорию
					*/ 
					
					$this->addEmptyDir($lPath);
					$this->PackingDirectory($fPath);
					
				} else {
					// Иначе добавляем файл
					$this->addFile($fPath, $lPath);
				}
			}
		}
		// Закрываем дескриптор обходимого каталога
		closedir($handle);
	}
}


?>
