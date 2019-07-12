<?php


                              
$to = "<talrash666@gmail.com>";
$url = "<sam-povar.by>";

/* заказать звонок */ 

$request = json_decode($_POST['param'], true);
	$order = $request['order'];

	$message = "<h1 style='background-color: #275050; color: #ffffff; text-align: center;'>Новый заказ</h1>";
	
	// ------------------------------order------------------------------
		
	$message .= "<ul style = 'list-style: none; padding: 0;'>";
	function buildMessage($array, $tagOpen="", $tagClose=""){
		global $message;
		foreach($array as $k => $v){
			$message .= $tagOpen;
			if(is_array($v)){
				buildMessage($v);
			}else{
				if(is_integer($k)){
					$message .= "<i style='font-size: 1.2rem;'>".$v."</i>, ";
				}else{
					$message .= "<div style='font-size: 1.2rem;'>".$k." : ".$v."</div>";
				}
				
			}
			$message .= $tagClose;
		}
	};
	buildMessage($order, "<li style='border-bottom: 1px solid #c4c4c4; padding: 20px'>", "</li>");

	$message .= "</ul>";
                                         
	// ------------------------------clientInfo------------------------------

	$message .= "<h2 style='background-color: #275050; color: #ffffff; text-align: center;'>Информация о клиенте</h2>";

	$name 		=  	htmlspecialchars(trim($request['clientInfo']["name"]));
	$phone 		=	htmlspecialchars(trim($request['clientInfo']["phone"]));
	$adress 	=	htmlspecialchars(trim($request['clientInfo']["adress"]));
	$paymethod 	=  	htmlspecialchars(trim($request['clientInfo']["paymethod"]));


	$message .= "<div style='font-size: 1.2rem;'>Имя: ".$name."</div>";
	$message .= "<div style='font-size: 1.2rem;'>Телефон: ".$phone."</div>";
	$message .= "<div style='font-size: 1.2rem;'>Адрес: ".$adress."</div>";
	$message .= "<div style='font-size: 1.2rem;'>Метод оплаты: ".$paymethod."</div>";

	// ------------------------------send------------------------------


	$subject = "Новый заказ";


/* Для отправки HTML-почты вы можете установить шапку Content-type. */
$headers= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=\"utf-8\"\r\n";

/* дополнительные шапки */
$headers .= "From: sam-povar.by";
//$headers .= "Cc: mail@ya.ru\r\n";
// $headers .= "Bcc: dnskulev.mrama@gmail.com\r\n";

/* и теперь отправим из */
mail($to, $subject, $message, $headers);