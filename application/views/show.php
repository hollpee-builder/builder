<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Просмотр сайта</title>
	<link rel="icon" type="image/png" href="/img/icon.png" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="<?php echo Url::get('/css/show.css'); ?>">
	<link rel="stylesheet" href="<?php echo Url::get('/css/main/modal.css'); ?>">
	
	<script type="text/javascript" src="<?php echo Url::get('/js/main/jquery.js'); ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_MAIN); ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get(FILE_LANGUAGES_JS); ?>" ></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/modal.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/main/notification.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo Url::get('/js/show.js'); ?>"></script>
</head>
<body>
	<div class="top-panel">
		<div class="top-panel-content">
			<img src="/img/logo.png" alt="" class="logo">
			<div class="listIconRepost">
				<img src="/img/editor/social/email.png" alt="" class="repostItem" data-type="message" label="Отправить ссылку <br/>сайта на email">
				<!-- <img src="/img/social/vk.png" alt="" class="repostItem" data-type="vk" label="Репост VKontakte"> -->
				<!-- <img src="/img/social/facebook.png" alt="" class="repostItem" data-type="facebook" label="Репост Facebook"> -->
				<div class="clear"></div>
			</div>
			<img src="/img/editor/close_icon.png" alt="" class="but-close" label="<?php echo Resource::$page_show_close_panel; ?>">

			<div class="screen-section">
				<div class="list-screen">
					<img src="/img/editor/screen/desktop.png" label="<?php echo Resource::$page_show_device_desktop; ?>" chosen="true" class="screen" alt="" data-screen="desktop">
					<img src="/img/editor/screen/desktop_hover.png" label="<?php echo Resource::$page_show_device_desktop; ?>" chosen="true" hover="true" alt="" class="screen" data-screen="desktop">
					<img src="/img/editor/screen/tab_h.png" label="<?php echo Resource::$page_show_device_tab_l; ?>" alt="" class="screen" data-screen="tab-l">
					<img src="/img/editor/screen/tab_h_hover.png" label="<?php echo Resource::$page_show_device_tab_l; ?>" hover="true" alt="" class="screen" data-screen="tab-l">
					<img src="/img/editor/screen/tab_v.png" label="<?php echo Resource::$page_show_device_tab_p; ?>" alt="" class="screen" data-screen="tab-p">
					<img src="/img/editor/screen/tab_v_hover.png" label="<?php echo Resource::$page_show_device_tab_p; ?>" hover="true" alt="" class="screen" data-screen="tab-p">
					<img src="/img/editor/screen/mobile_h.png" label="<?php echo Resource::$page_show_device_mobile_l; ?>" alt="" class="screen" data-screen="mobile-l">
					<img src="/img/editor/screen/mobile_h_hover.png" label="<?php echo Resource::$page_show_device_mobile_l; ?>" hover="true" alt="" class="screen" data-screen="mobile-l">
					<img src="/img/editor/screen/mobile_v.png" alt="" label="<?php echo Resource::$page_show_device_mobile_p; ?>" class="screen" data-screen="mobile-p">
					<img src="/img/editor/screen/mobile_v_hover.png" label="<?php echo Resource::$page_show_device_mobile_p; ?>" hover="true" alt="" class="screen" data-screen="mobile-p">
					<div class="clear"></div>
				</div>
				
			</div>
			<div class="clear"></div>
		</div>
	</div>
	<div class="wrap-site" data-screen="desktop">
		<div class="siteId" style="display:none;"><?php echo $siteId ?></div>
		<iframe id="siteFrame" src="/user/<?php echo $userId ?>/<?php echo $siteId ?>/file/?page_id=<?php echo $pageId; ?>&site_type=<?php echo $siteType ?>" frameborder="0"></iframe>
	</div>
</body>
</html>


