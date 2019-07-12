<?php 

if($_POST){

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';



//$mail->SMTPDebug = 3;                               

$mail->isSMTP();                                      
$mail->Host = 'smtp.mail.ru';  																							
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'mediarama.by.mail2@mail.ru'; // Ваш логин от почты с которой будут отправляться письма
$mail->Password = 'SSD1735271507ssd'; // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'ssl';                      
$mail->Port = 465; 

$mail->setFrom('mediarama.by.mail2@mail.ru','sam-povar.by'); // от кого будет уходить письмо?
$mail->addAddress('talrash666@gmail.com');     // Кому будет уходить письмо 
// $mail->addAddress('mail2@gmail.com');     // Кому будет уходить письмо 
// $mail->addAttachment($_FILES['upload']['tmp_name'], $_FILES['upload']['name']);    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML


$request = json_decode($_POST['param'], true);
	$order = $request['order'];

	$message = '';

	// ------------------------------clientInfo------------------------------

	$name 		=  	htmlspecialchars(trim($request['clientInfo']["name"]));
	$phone 		=	htmlspecialchars(trim($request['clientInfo']["phone"]));
	$adress 	=	htmlspecialchars(trim($request['clientInfo']["adress"]));
	$paymethod 	=  	htmlspecialchars(trim($request['clientInfo']["paymethod"]));

	// ------------------------------clientInfo------------------------------
	
	$message .= "<p>Имя: ".$name."</p>";
	$message .= "<p>Телефон: ".$phone."</p>";
	$message .= "<p>Адрес: ".$adress."</p>";
	$message .= "<p>Метод оплаты: ".$paymethod."</p>";
	
	// ------------------------------order------------------------------
		
	$message .= "<ul>";
	function buildMessage($array, $tagOpen="", $tagClose=""){
		global $message;
		foreach($array as $k => $v){
			$message .= $tagOpen;
			if(is_array($v)){
				buildMessage($v);
			}else{
				if(is_integer($k)){
					$message .= "<span>".$v."</span>, ";
				}else{
					$message .= "<p>".$k." : ".$v."</p>";
				}
				
			}
			$message .= $tagClose;
		}
	};
	buildMessage($order, "<li>Пицца<br>", "</li>");

	$message .= "</ul>";
	// ------------------------------order------------------------------

$mail->Body = $message;

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




