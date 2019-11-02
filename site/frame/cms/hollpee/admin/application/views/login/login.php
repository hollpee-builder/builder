<?php 
	if ($_POST && array_key_exists('email', $_POST)) $email = $_POST['email'];
	else $email = '';
?>
	<form action="<?php echo HlpUrl::attach('/login/loginCheck') ?>" method="post" id="formLoginRegister">
		<div class="form-item">
			<input type="text" name="email" class="input" value="<?php echo $email ?>" placeholder="hollpee@gmail.com">
		</div>
		<div class="form-item">
			<input type="password" name="password" class="input"  placeholder="Пароль">
		</div>
		<input type="submit" id="loginSubmit" class="send" value="Войти">
	</form>
	<a href="<?php echo HlpUrl::attach('/login/restory') ?>" id="butRestoryPsw">Восстановить пароль</a>
