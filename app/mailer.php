<?php 

if($_POST){

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = htmlspecialchars(trim($_POST["name"]));
$phone = htmlspecialchars(trim($_POST["phone"]));
$pos = htmlspecialchars(trim($_POST["pos-name"]));



//$mail->SMTPDebug = 3;                               

$mail->isSMTP();                                      
$mail->Host = 'smtp.mail.ru';  																							
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'vash_sajt@mail.ru'; // Ваш логин от почты с которой будут отправляться письма
$mail->Password = 'site2019'; // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'ssl';                      
$mail->Port = 465; 

$mail->setFrom('vash_sajt@mail.ru','сварка-аргоном.бел'); // от кого будет уходить письмо?
$mail->addAddress('alekseimurin777@gmail.com');     // Кому будет уходить письмо 
$mail->addAddress('nikitamdln@gmail.com');     // Кому будет уходить письмо 
$mail->addAttachment($_FILES['upload']['tmp_name'], $_FILES['upload']['name']);    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML




if ($phone != ''){

    $mail->Body = " 
        <table>
            <tr>
                <td style='padding: 10px; font-weight: 600; width:250px;text-align: right; padding-right: 30px;'>
                Имя:
                </td>
                <td style='padding: 10px; border: #000000 1px solid; background-color: #f8f8f8; width:500px;'>
                $name
                </td>
            </tr>
        </table>
        <br />
        <table>
            <tr>
                <td style='padding: 10px; font-weight: 600; width:250px;text-align: right; padding-right: 30px;'>
                Телефон: 
                </td>
                <td style='padding: 10px; border: #000000 1px solid; background-color: #f8f8f8; width:500px;'>
                $phone
                </td>
            </tr>
        </table>
        <br />";
        /* тема/subject */
        $mail->Subject = 'Клиент хочет: '.$pos;
    
    }
/* оставьте отзыв */ 
  


	if( $mail->send() ){
		$answer = '1';
	}else{
		$answer = '0';
		// /*echo 'Письмо не может быть отправлено. ';
		echo 'Ошибка: ' . $mail->ErrorInfo;
	}
    die( $answer );
    
}
?>


