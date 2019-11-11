<?php  
/**
* Формат страницы HTML
*
*/
class FormatPageHTML extends FormatPage {
	protected $archive_format = 'zip';	
	protected $type = 'html';
	protected $fileType;
	protected $cmsObj = false;
	protected $cmsHollpeeType;

	public function __construct($userId, $cmsName, $fileType = "", $cmsHollpeeType = false)
	{
		parent::__construct($userId);
		$this->fileType = $fileType;
		$this->cmsName = $cmsName;
		$this->cmsHollpeeType = $cmsHollpeeType;
	}

	/**
	* Создает текстовый фаил
	*
	* @return 	void
	* @uses 	$this->create()
	*/
	protected function createTextFile()
	{
		// добавление стандартныйх файлов
		$this->addStdFiles();
		// для cms
		$this->addAddedFiles();
		// создаем список страниц
		$this->createListPage();
		// шрифты
		$this->addFontLocal('/css');
	}

/**********************************************************************************************/
	/**
	* Добавление стандартных файлов
 	*
	* @see $this->createTextFile()
	*/
	private function addStdFiles()
	{
		// копируем каркас 
		$framePath = $this->framePath;
		Dir::copy($framePath . '/css', $this->pathProject . '/css');
		Dir::copy($framePath . '/js', $this->pathProject . '/js');
		Dir::copy($framePath . '/images', $this->pathProject . '/images');
		Dir::copy($framePath . '/files', $this->pathProject . '/files');

		Dir::copy($_SERVER['DOCUMENT_ROOT'].'/images/hlp_main', $this->pathProject . '/images/hlp_main');
	}

/*********************************************************************************/
	private function addAddedFiles()
	{
		// для cms
		Dir::copy($this->framePath.'/cms/'.$this->cmsName, $this->pathProject);
		
		if ($this->isCmsNameHollpee()) $this->addFileCmsHollpee();
		else if ($this->isCmsNameWp()) $this->addFileCmsWp();
		else $this->addFileOnlyHtml();
	}

	private function getPageName($page)
	{
		$name = $page['url_name'];

		if ($this->isCmsNameWp()) {
			if ($name != 'index' 
					&& $name != 'content'
					&& $name != 'single'
					&& $name != 'single-product'
					&& $name != 'taxonomy-product_cat'
					) {
				$name = 'page-' . $name;
			}
		} else if ($this->isCmsNameHollpee()) {
			if ($name != '404') {
				$name = $this->getSiteId() . '_' . $page['page_id'];
			}
		}

		return $name;
	}

	private function addFileOnlyHtml()
	{
		// для формы email
		$emailPath = $this->pathProject . '/hlp_email.txt';
		$userEmail = 'test@mail.ru';
		file_put_contents($emailPath, $userEmail);
	}

	private function addFileCmsWp()
	{
		$cmsWpPath = $this->framePath . '/cms/wp/';

	}
/***********************************************************************************/

	private function addFileCmsHollpee()
	{
		$this->createListPageJson();
		// брендинг
		$this->addFileBrending();
		// добавляем файл константы
		$this->addFileConstHollpee();
	}

	private function addFileBrending()
	{
		// копируем логотипы для брендирования
		$objCms = new Cms();
		$adminFolderLogoPath = $this->pathProject . '/admin/img/logo';
		$objCms->copyLogoAdmin($this->userId, $adminFolderLogoPath);
	}

	private function createListPageJson()
	{
		$listPages = $this->siteData['pages'];
		$listPagesJson = array();

		foreach ($listPages as $page) {
			$siteId = $this->getSiteId();
			$fullPageId = $siteId . '_' . $page['page_id'];
			$name = $fullPageId;

			$urlName = $page['url_name'];
			if ($urlName == '404') continue;

			$fileName = $urlName;
			if ($fileName == "index") $fileName .= '.php'; 

			$listPagesJson[$fullPageId] = array(
				'page_id'=>$fullPageId,
				'site_id'=>$siteId,
				'file'=>$fileName
			);
		}

		$listPagesJson = json_encode($listPagesJson, true);
		file_put_contents($this->pathProject.'/data/hlp_site.json', $listPagesJson);
	}

	/*
	* Установка типа cms
	*
	*
	* @see 	this::createFileCms()
	*/
	private function addFileConstHollpee()
	{
		$cmsType = $this->cmsHollpeeType;

		// прописываем тип в фале константы
		$fileConstPath = $this->pathProject.'/admin/application/const.php';
		// $fileConstContent = file_get_contents($fileConstPath);
		// $fileConstContent = preg_replace('/@@@@@cms_type@@@@@/', $cmsType, $fileConstContent);
		$fileConstContent = "<?php\ndefine('CMS_TYPE', '".$cmsType."');\n?>";
		file_put_contents($fileConstPath, $fileConstContent);
	}

/******************************************************************************/

	/**
	* Созлает список страниц
	*
	* @see 	$this->createTextFile()
	*/
	private function createListPage()
	{
		$listPages = $this->siteData['pages'];
		$listPagesJson = array();

		$siteId = $this->getSiteId();
		$siteMain = $this->siteData['main'];
		// для многостраничника
		if ($this->isSiteTypeSite()) {
			$contentHeader = Image::clearImgSrc($siteMain['header'], $this->getFolderImages());
			$contentFooter = Image::clearImgSrc($siteMain['footer'], $this->getFolderImages());
			
			if ($this->isCmsNameWp()) {
				$contentHeader = file_get_contents($this->pathProject.'/header.php') . $contentHeader;
				$contentFooter = $contentFooter ."\r\n" . file_get_contents($this->pathProject.'/footer.php');

				$this->writeTextFile('/header.php', $contentHeader);
				$this->writeTextFile('/footer.php', $contentFooter);
			} else {
				$this->writeTextFile('/header_'.$siteId.'.php', $contentHeader);
				$this->writeTextFile('/footer_'.$siteId.'.php', $contentFooter);
			}
		}
		
		if ($this->isSiteTypeSite() || $this->isCmsNameWp()) {
			$mainCss = Image::clearImgSrc($siteMain['css'], $this->getFolderImages(), $this->getFolderBgImage());
			$this->writeTextFile('/css/main_'.$siteId.'.css', $mainCss, 'css');
		}

		foreach ($listPages as $page) {
			$name = $this->getPageName($page);

			// html
			$contentHtml = $this->getHtmlContent($page, $name);
			$contentHtml = Image::clearImgSrc($contentHtml, $this->getFolderImages()); 
			// записуем
			$htmlName = '/'. $name . '.' . $this->fileType;
			$this->writeTextFile($htmlName, $contentHtml, 'php');

			// записываем css
			$contentCss = Image::clearImgSrc($page['css'], $this->getFolderImages(), $this->getFolderBgImage());
			$fileCss = '/css/'.$name.'.css';
			$this->writeTextFile($fileCss, $contentCss, 'css');
		}
	}

	private function getFolderBgImage()
	{
		if ($this->isCmsNameWp()) {
			return 'images';
		} else {
			return '../images';
		}
	}

	/**
	* Многостраничник или нет
	*
	* @see 	this::createListPage()
	* @see 	this::getHtmlContent()
	*/
	private function isSiteTypeSite()
	{
		return $this->siteData['type'] == 'site';
	}
	
	/**
	* Запись html
	*
	* @see 	this.createTextFile()
	*/
	private function getHtmlContent($page, $pageName)
	{
		if ($this->isCmsNameWp()) {
			$content = '<?php get_header(); ?>';
			$content .= "\r\n" . $page['html'];
			$content .= '<?php get_footer(); ?>' . "\r\n";
		} else {
			$content = $this->getHtmlContentStd($page, $pageName);
		}

		return $content;
	}

	private function getHtmlContentStd($page, $pageName)
	{
		// header
		$header = file_get_contents($this->framePath . '/inc/header.php');
		$header = $this->addSeo($page, $header);
		$header = $this->addOpenGraph($page, $header);
		$header = $this->addAddedCodeHeader($page, $header);
		$header = preg_replace('/@@@@@site_id@@@@@/', $this->getSiteId(), $header);
		$header = preg_replace('/@@@@@page_name@@@@@/', $pageName, $header);
		$header = preg_replace('/@@@@@time@@@@@/', time(), $header);
		$header = preg_replace("/[\r\n]+[\t]+[\r\n]+/", "\r\n", $header);

		// footer
		$footer = file_get_contents($this->framePath . '/inc/footer.php');
		$footer = $this->addAddedCodeFooter($page, $footer);
		
		/********************************/
		$siteId = $this->getSiteId();
		// для многостраничника
		if ($this->isSiteTypeSite()) {
			$cssMainLink = "\r\n\t".'<link type="text/css" rel="stylesheet" href="css/main_'.$siteId.'.css?id='.time().'">';
		} else {
			$cssMainLink = '';
		}
		$header = preg_replace("/@@@@@css_main@@@@@/", $cssMainLink, $header);
		if ($this->isSiteTypeSite()) {
			if ($this->fileType == "html") {
				$contentHeader = Image::clearImgSrc($this->siteData['main']['header'], $this->getFolderImages());
				$contentFooter = Image::clearImgSrc($this->siteData['main']['footer'], $this->getFolderImages());
				$header = $header . $contentHeader;
				$footer = $contentFooter . $footer;
			} else {
				$header = $header . "\t\t" . '<?php require_once \'header_'.$siteId.'.php\';?>'."\r\n\t\t<div class=\"hlp-page\">\r\n";
				$footer = "\t\t</div>\r\n\t\t" . '<?php require_once \'footer_'.$siteId.'.php\';?>' ."\r\n". $footer;
			}
		}
		/********************************/

		// склеиваем
		$content = $header . $page['html'] . $footer;

		return $content;
	}

	protected function addSeo($page, $header)
	{
		$pageData = $page['data'];
		$seo = $pageData['seo'];
		$seoTitle = $seo['title'];
		$seoDesc = $seo['description'];
		$seoKey = $seo['key'];

		// seo для cms
		if ($this->isCmsNameHollpee()) {
			$pageId = $page['page_id'];
			$siteId = $this->getSiteId();
			$hlpIndexMain = 'i-p'.$siteId.'_'.$pageId;
			$seoTitle = "<?php echo HlpData::getResource('".$hlpIndexMain."-title', '".$seoTitle."'); ?>";
			$seoDesc = "<?php echo HlpData::getResource('".$hlpIndexMain."-description', '".$seoDesc."'); ?>";
			$seoKey = "<?php echo HlpData::getResource('".$hlpIndexMain."-keywords', '".$seoKey."'); ?>";
		}	

		
		$header = preg_replace('/@@@@@title@@@@@/', $seoTitle, $header);
		$header = preg_replace('/@@@@@description@@@@@/', $seoDesc, $header);
		$header = preg_replace('/@@@@@keywords@@@@@/', $seoKey, $header);
		

		return $header;
	}

	protected function addOpenGraph($page, $header)
	{
		$opengraph = $page['data']['opengraph'];

		$titleText = '';
		if ($opengraph['title']) {
			$titleText .= "\r\n\t" . '<meta property="og:title" content="'.$opengraph['title'].'"/>';
			if ($opengraph['description']) {
				$titleText .= "\r\n\t" . '<meta property="og:description" content="'.$opengraph['description'].'"/>';
			}
			if ($opengraph['image']) {
				$titleText .= "\r\n\t" . '<meta property="og:image" content="'.$opengraph['image'].'">';
			}
			$titleText .= "\r\n\t" . '<meta property="og:type" content="article"/>';
		}
		$header = preg_replace('/@@@@@opengraph@@@@@/', $titleText, $header);
			
		return $header;
	}

	protected function addAddedCodeHeader($page, $header)
	{
		$pageData = $page['data'];

		$siteCodeAdded = $this->siteData['data']['added_code'];
		$pageCodeAdded = $pageData['added_code'];
		
		// в начале файла
		$codeBeforeHead = $siteCodeAdded['before_head'];
		if ($codeBeforeHead) $codeBeforeHead = $codeBeforeHead . "\r\n";
		$codeBeforeHead .= $pageCodeAdded['before_head']; 
		if ($codeBeforeHead) $codeBeforeHead = $codeBeforeHead . "\r\n";	
		// head и дополнительные файлы
		$codeHead = $siteCodeAdded['head'];
		if ($codeHead) $codeHead =  $codeHead."\r\n";
		$codeHead .= $pageCodeAdded['head'];
		if ($codeHead) $codeHead = "\r\n" . $codeHead;
		// body start
		$codeBodyStart = $siteCodeAdded['body_start'];
		if ($codeBodyStart) $codeBodyStart =  $codeBodyStart."\r\n";
		$codeBodyStart .= $pageCodeAdded['body_start'];
		if ($codeBodyStart) $codeBodyStart = "\r\n" . $codeBodyStart;
		
		$header = preg_replace('/@@@@@before_head@@@@@/', $codeBeforeHead, $header);
		$header = preg_replace('/@@@@@head@@@@@/', $codeHead, $header);
		$header = preg_replace('/@@@@@body_start@@@@@/', $codeBodyStart, $header);

		return $header;
	}

	protected function addAddedCodeFooter($page, $footer)
	{
		$pageData = $page['data'];

		$siteCodeAdded = $this->siteData['data']['added_code'];
		$pageCodeAdded = $pageData['added_code'];
		
		// body end
		$codeBodyEnd = '';
		$codeBodyEnd .= $siteCodeAdded['body_end'];
		if ($codeBodyEnd) $codeBodyEnd = "\r\n".$codeBodyEnd . "\r\n";
		$codeBodyEnd .= $pageCodeAdded['body_end'];
		if ($codeBodyEnd) $codeBodyEnd = $codeBodyEnd . "\r\n";

		$footer = preg_replace('/@@@@@body_end@@@@@/', $codeBodyEnd, $footer);

		return $footer;
	}
	/**
	* 
	*/
	protected function getFolderImages()
	{
		return $this->isCmsNameHollpee() ? '/'.$this->getSiteId() : '';
	}

/******************************************************************************/

	/**
	* записывает страницу  
	*
	*
	*/
	private function writeTextFile($name, $html, $fileType = 'php')
	{
		/**********************/
		if ($this->isCmsNameWp() && $fileType == 'css') {
			$name = '/style.css';
		}
		/**********************/

		// перенос строки
		$html = preg_replace("/\\r?\\n/", "\r\n", $html);	
		// для карты
		$html = preg_replace("/src-map=/", 'src=', $html);

		// символы
		$html = preg_replace("/&#43;/", '+', $html);

		$html = preg_replace("/<\!--\?php/", '<?php', $html);
		$html = preg_replace("/\-->/", '>', $html);

		// widge
		// $html = FormatPageHTMLWidget::replacePath($html, $fileType);
		// http
		$html = Clear::jsonHttp($html);
		// перенос строки
		$html = preg_replace("/@@@@@sign_rn@@@@@/", "\r\n", $html);
		$html = preg_replace("/@@@@@sign_tab@@@@@/", "\t", $html);
		
		$html = preg_replace("/%3A/", ':', $html);
			
		$file_path = $this->pathProject.'/'.$name;
		$modeWrite = $fileType == 'css' ? 'a' : 'w'; 
		$file = fopen($file_path, $modeWrite);
		fwrite($file, $html);
		fclose($file);
	}

	protected function getSiteId()
	{
		$cmsSiteId = $this->siteData['cms_site_id'];
		if ($cmsSiteId) return $cmsSiteId; 
		else return $this->siteId;
	}

/**************************************************************************************/	

}//end class
