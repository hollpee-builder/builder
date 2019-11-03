<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo Resource::$admin_title; ?> | <?php echo $titleContent; ?></title>
	<link rel="icon" type="image/png" href="/img/icon.png" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<link rel="stylesheet" href="<?php echo Url::get('/css/main/modal.css') ?>" >
	<link rel="stylesheet" href="<?php echo Url::get('/css/main/support.css') ?>" >
	<link rel="stylesheet"  href="<?php echo Url::get('/css/admin.css') ?>">
	
	<script type="text/javascript" src="<?php echo Url::get('/js/main/jquery.js') ?>"></script>
	
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_MAIN) ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_JS) ?>" ></script>

	<script type="text/javascript" src="<?php echo Url::get('/js/main/form.js') ?>"></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/modal.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/notification.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/support.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/admin.js') ?>"></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/education.js') ?>"></script>
	<?php echo $stylesheet ?>
	
	<script type="text/javascript">
		var DOMAIN_HOSTING="<?php echo DOMAIN_HOSTING; ?>";
	</script>

	<!-- Start of hollpee Zendesk Widget script -->
	<!-- End of hollpee Zendesk Widget script -->

</head>
<body>
	<div class="wrapper">
		<?php echo Device::panelNoSupportBrowser(); ?>
		<div class="sectionLeft">
			<div class="blockLogo">
				<img src="/img/logo.png" alt="" class="logo">
			</div>

			

			<div class="blockNav">
				<a href="/" class="navItem navSite">
					<span></span>
					Сайты
				</a>
				<a href="https://helpdesk.local" target="_blank" class="navItem navTutorial">
					<span></span>
					База знаний
				</a>
				<a href="/cms" class="navItem navCms">
					<span></span>
					CMS
				</a>
			
			</div>
			
		</div>
		<div class="sectionHeader">
			<div class="headerLeft">

			</div>
			<!-- <div class="headerRight">
				<div class="btn butHeaderAccount">
					<img src="/img/avatar10.jpg" class="butHeaderAccountAvatar" alt="">
					<div class="butHeaderAccountSubMenuWrap">
						<div class="butHeaderAccountSubMenu">
							<div class="butHeaderAccountSubMenuArrow"></div>
							<a href="/login/exitAccount" class="accountSubMenuItem">
								Выйти
							</a>
						</div>
					</div>
					<span class="caret"></span>
				</div>
				<div class="clear"></div>
			</div> -->
			<div class="clear"></div>
		</div>
		<div class="sectionMain">
			<div class="cotentTopBlock">
				<div class="contentTitleBlock">
					<span class="contentTitle"><?php echo $titleContent; ?></span> 
					<span class="contentTitleDesc"><?php echo $titleContentDesc; ?></span>
				</div>
				<div class="topBlockBut">
					<a href="/choseStyle" target="_blank" class="butTop btn butAddSite">Добавить сайт</a>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="contentBlock">
				<?php echo $content ?>
			</div>
		</div>
	</div>

<!-- <script type='text/javascript' src="/js/widget/support.js"></script> -->
<!-- <script type='text/javascript' src="/js/widget/analytics.js"></script> -->

</body>
</html>
