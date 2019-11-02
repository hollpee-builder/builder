<?php $hlpAnalyticsSite = HlpAnalytics::getSite(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Личный кабинет</title>
	<link rel="icon" type="image/png" href="/img/icon.png" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/main/jquery.js') ?>"></script>
	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/main/widget.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/main/config.js') ?>" ></script>
	
	<link rel="stylesheet" href="<?php echo HlpUrl::attach('/css/main/widget.css') ?>" >
	<link rel="stylesheet"  href="<?php echo HlpUrl::attach('/css/admin.css') ?>">
	<link rel="stylesheet"  href="<?php echo HlpUrl::attach('/css/responsive.css') ?>">
	<?php echo $stylesheet ?>
</head>
<body data-cms-type="<?php if (defined('CMS_TYPE')) echo CMS_TYPE ?>">

	<div class="wrapper">
		<div class="sectionLeft">
			<div class="blockLogo">
				<img src="<?php echo HlpUrl::attach('/img/logo/logo_w.png') ?>" alt="" class="logo">
			</div>

			<div class="leftBlockInfo">
				Сегодня
				<div class="leftBlockInfoItem">
					визитов: <span><?php echo $hlpAnalyticsSite['visit_day']; ?></span>
					, лидов: <span><?php echo $hlpAnalyticsSite['lead_day']; ?></span>
				</div>
				Неделя
				<div class="leftBlockInfoItem">
					визитов: <span><?php echo $hlpAnalyticsSite['visit_week']; ?></span>
					, лидов: <span><?php echo $hlpAnalyticsSite['lead_week']; ?></span>
				</div>
			</div>

			<div class="blockNav">
				<a href="<?php echo HlpUrl::attach('/') ?>" class="navItem nav-item" data-type="site">
					<span></span>
					Сайт
				</a>
				<a href="<?php echo HlpUrl::attach('/lead') ?>" class="navItem nav-item" data-type="lead">
					<span></span>
					Лиды
					<?php 
						$countNew = HlpDbLead::getInstance()->getCountNew(); 
						if ($countNew) {
							echo '<div class="new-count-lead">'.$countNew.'</div>';
						}
					?>
				</a>
				<a href="<?php echo HlpUrl::attach('/integration') ?>" class="navItem nav-item" data-type="integration">
					<span></span>
					Интеграции
				</a>
				<a href="<?php echo HlpUrl::attach('/account') ?>" class="navItem nav-item" data-type="account">
					<span></span>
					Кабинет
				</a>
			</div>

			<div class="blockEducation">
				<!-- <a href="http://hollpee.ru" target="_blank" class="butEducation">Видео уроки</a> -->
				<div class="copyright">
					Copyright © <?php echo date("Y"); ?>
				</div>
			</div>
		</div>
		<div class="sectionHeader">
			<div class="headerLeft">

			</div>
			<div class="headerRight">
				<div class="btn butHeaderAccount">
					<img src="<?php echo HlpUrl::attach('/img/avatar10.jpg') ?>" class="butHeaderAccountAvatar" alt="">
					<div class="butHeaderAccountSubMenuWrap">
						<div class="butHeaderAccountSubMenu">
							<div class="butHeaderAccountSubMenuArrow"></div>
							<a href="<?php echo HlpUrl::attach('/login/exitAccount') ?>" class="accountSubMenuItem">
								Выйти
							</a>
						</div>
					</div>
					<span class="caret"></span>
				</div>
				<div class="clear"></div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="sectionMain">
			<div class="cotentTopBlock">
				<div class="contentTitleBlock">
					<span class="contentTitle"><?php echo $title; ?></span> 
				</div>
				<div class="topBlockBut wrap-but-upload-file">
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="contentBlock" data-type="<?php echo $type ?>">
				<?php echo $content ?>
			</div>
		</div>
	</div>
</body>
</html>

<script>
	var pageType = $(".contentBlock").attr("data-type"); 
	$(".nav-item").filter("[data-type='"+pageType+"']").attr("data-chosen", "true");
</script>
