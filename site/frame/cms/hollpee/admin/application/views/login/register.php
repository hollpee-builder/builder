<?php 
	if ($_POST && array_key_exists('email', $_POST)) $email = $_POST['email'];
	else $email = '';
?>	
	<form action="<?php echo HlpUrl::attach('/login/registerCheck') ?>" method="post" class="formLoginRegister">
		<div class="form-item">
			<input type="text" name="email" class="input" value="<?php echo $email ?>" placeholder="hollpee@gmail.com">
		</div>
		<div class="form-item">
			<input type="password" name="password" class="input" placeholder="Пароль">
		</div>
		<div class="form-item">
			<input type="password" name="password-2" class="input" placeholder="Повторите пароль">
		</div>
		<input type="submit" id="registerSubmit" class="send"  value="Создать">
	</form>
