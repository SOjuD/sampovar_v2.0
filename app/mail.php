<?php


$name = htmlspecialchars(stripslashes(trim($_POST["name"])));
$phone = htmlspecialchars(stripslashes(trim($_POST["phone"])));
$pos = htmlspecialchars(stripslashes(trim($_POST["pos-name"])));


                              
$to = "<azyavchikov.dim@mail.ru>";
$url = "<rem-ok.by>";

/* заказать звонок */ 

if($phone != ''){
   
    $message = " 
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
        $subject = 'Клиент хочет: '.$pos;
    
    }
                                         
/* Для отправки HTML-почты вы можете установить шапку Content-type. */
$headers= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=\"utf-8\"\r\n";

/* дополнительные шапки */
$headers .= "From: Заявка с сайта $url\r\n";
//$headers .= "Cc: mail@ya.ru\r\n";
$headers .= "Bcc: dnskulev.mrama@gmail.com\r\n";

/* и теперь отправим из */
mail($to, $subject, $message, $headers);