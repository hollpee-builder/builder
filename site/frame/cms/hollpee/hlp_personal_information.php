<?php include_once 'php/hlp_privacy_policy_code.php'; ?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>Персональные данные</title>
	<meta name="description" content="">
	<meta name="keywords" content="">
	<link rel="icon" type="image/png" href="/images/favicon.ico" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link type="text/css" rel="stylesheet" href="css/hlp_main.css">
	<script type="text/javascript" src="js/jquery.js" ></script>
	<script type="text/javascript" src="js/hlp_script.js" ></script>
</head>
<body>
<style>
	@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i&subset=cyrillic,latin);

.hlp-site {
	text-align: left;
}

.section-1 > .hlp-section-content {
	padding-bottom: 85px;
}

.heading-1 {
	width: 100%;
	margin-top: 0px;
	margin-bottom: 35px;
	margin-left: 0px;
	margin-right: 0px;
	text-align: center;
	font-size: 24px;
	font-size: 1.5rem;
}

.text-1 {
	width: 100%;
	margin-top: 0px;
	margin-bottom: 20px;
	margin-left: 0px;
	margin-right: 0px;
}

.block-1 {
	width: 100%;
	margin-left: 0px;
	margin-right: 0px;
}

.text-2 {
	width: 100%;
	margin-bottom: 15px;
	margin-left: 0px;
	margin-right: 0px;
	padding-left: 30px;
}
</style>
	<div class="hlp-site hlp-no-flexbox">

		<section data-hlp-id="i-7" class="hlp-section section-1">
			<div class="hlp-section-content">
				<h2 data-hlp-id="i-11" class="heading-1"><?php echo HlpData::getResource('i-11', 'Согласие на обработку персональных данных'); ?></h2>
				<p data-hlp-id="i-141" class="text-1"><?php echo HlpData::getResource('i-141', 'Настоящим я, далее – «Субъект Персональных Данных», во исполнение требований Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных» (с изменениями и дополнениями) свободно, своей волей и в своем интересе даю свое согласие '.$profileOrganization.'  (далее – «Сайт», адрес: '.$profileAddress.'  ) на обработку своих персональных данных, указанных при регистрации путем заполнения веб-формы на сайте '.$host.' (далее – Сайт), направляемой (заполненной) с использованием Сайта.'); ?></p>
				<p data-hlp-id="i-142" class="text-1"><?php echo HlpData::getResource('i-142', 'Под персональными данными я понимаю любую информацию, относящуюся ко мне как к Субъекту Персональных Данных, в том числе мои фамилию, имя, отчество, адрес, образование, профессию, контактные данные (телефон, факс, электронная почта, почтовый адрес), фотографии,  иную другую информацию. Под обработкой персональных данных я понимаю сбор, систематизацию, накопление, уточнение, обновление, изменение, использование, распространение, передачу, в том числе трансграничную, обезличивание, блокирование, уничтожение, бессрочное хранение), и любые другие действия (операции) с персональными данными.'); ?></p>
				<p data-hlp-id="i-143" class="text-1"><?php echo HlpData::getResource('i-143', 'Датой выдачи согласия на обработку персональных данных Субъекта Персональных Данных является дата отправки регистрационной веб-формы с Сайта.'); ?></p>
				<p data-hlp-id="i-144" class="text-1"><?php echo HlpData::getResource('i-144', 'Сайт принимает необходимые правовые, организационные и технические меры или обеспечивает их принятие для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных, а также принимает на себя обязательство сохранения конфиденциальности персональных данных Субъекта Персональных Данных. Сайт вправе привлекать для обработки персональных данных Субъекта Персональных Данных субподрядчиков, а также вправе передавать персональные данные для обработки своим аффилированным лицам, обеспечивая при этом принятие такими субподрядчиками и аффилированными лицами соответствующих обязательств в части конфиденциальности персональных данных.'); ?></p>
				<p data-hlp-id="i-145" class="text-1"><?php echo HlpData::getResource('i-145', 'Я ознакомлен(а), что:'); ?></p>
				<div data-hlp-id="i-146" class="hlp-wrap block-1">
					<p data-hlp-id="i-147" class="text-2"><?php echo HlpData::getResource('i-147', '1. настоящее согласие на обработку моих персональных данных, указанных при заполнении формы на Сайте, направляемых (заполненных) с использованием Cайта, действует в течение 20 (двадцати) лет с момента регистрации на Cайте Интернет-магазина;'); ?></p>
					<p data-hlp-id="i-148" class="text-2"><?php echo HlpData::getResource('i-148', '2. согласие может быть отозвано мною на основании письменного заявления в произвольной форме;'); ?></p>
					<p data-hlp-id="i-149" class="text-2"><?php echo HlpData::getResource('i-149', '3. предоставление персональных данных третьих лиц без их согласия влечет ответственность в соответствии с действующим законодательством Российской Федерации.'); ?></p>
				</div>
			</div>
		</section>
		<div class="hlp-list-modal"></div>
	</div>
</body>
</html>
