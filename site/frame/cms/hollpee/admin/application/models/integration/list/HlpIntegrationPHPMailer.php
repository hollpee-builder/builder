<?php
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class HlpIntegrationPHPMailer extends HlpIntegrationBasic {

    public function execute($service, $user)
    {

    }

    public static function send($service, $subject, $message)
    {
        $userName = $service['login'];
        $userPsw = $service['password'];

        if (array_key_exists('host', $service) && $service['host'])
            $host = $service['host'];
        else 
            $host = 'smtp.yandex.ru';
        
        if (array_key_exists('port', $service) && $service['port']) 
            $port = $service['port'];
        else
            $port = 587;

        if (array_key_exists('encryption', $service) && $service['encryption']) 
            $encryption = $service['encryption'];
        else
            $encryption = 'tls';


        $fromEmail = $service['login'];
        $fromName = 'Admin';

        $toEmail = $service['to_email'];
        $toName = 'Admin';


        $src = HLP_ADMIN_FOLDER_PATH.'/application/models/integration/libs/PHPMailer';
        require $src.'/Exception.php';
        require $src.'/PHPMailer.php';
        require $src.'/SMTP.php';

        $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
        try {
            //Server settings
            $mail->SMTPDebug = 2;                                 // Enable verbose debug output
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = $host;                   // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = $userName;              // SMTP username
            $mail->Password = $userPsw;                       // SMTP password
            
            if ($encryption != 'none')
                $mail->SMTPSecure = $encryption;
            $mail->Port = $port;                                // TCP port to connect to
            $mail->CharSet = "UTF-8"; 

            //Recipients
            $mail->setFrom($fromEmail, $fromName);          //This is the email your form sends From
            $mail->addAddress($toEmail, $toName); // Add a recipient address

            //Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $message;

            $mail->send();
            // echo 'Message has been sent';
        } catch (Exception $e) {
            // echo 'Message could not be sent.';
            // echo 'Mailer Error: ' . $mail->ErrorInfo;
        }
        
    }

}

?>