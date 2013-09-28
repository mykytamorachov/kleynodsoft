<?php
//  << - stoned animations online mailform.php - >>
// <<< - Stoned Animations online © 2000 - 2001 - >>>


// All you need to change is the e-mail addy:
$email = 'info@kleynodsoft.com';
$subject = 'Message from KleynodSoft site';

$Primishennya = $_POST['Primishennya'];
    $Primishennya = iconv('UTF-8', 'windows-1251', $Primishennya);
$poverhiv = $_POST['poverhiv'];
$kimnat = $_POST['kimnat'];
$vikon = $_POST['vikon'];
$inet = $_POST['inet'];
   $inet = iconv('UTF-8', 'windows-1251', $inet);
$kilvideo = $_POST['kilvideo'];
$phone = $_POST['phone'];
$address  = nl2br($_POST['adress']);
$address = iconv('UTF-8', 'windows-1251', $address);
$PIB  = nl2br($_POST['PIB']);
$PIB = iconv('UTF-8', 'windows-1251', $PIB);

mail($email,$subject,"Data: Приміщення:$Primishennya,\n Поверхів:$poverhiv,\n Кімнат:$kimnat,\n Вікон:$vikon,\n Интернет:$inet,\n Відеокамер:$kilvideo,\n Телефон:$phone,\n Адреса:$address, \n ПІБ:$PIB\n");

?>

<html>

<head>
<title>Sent!</title>
</head>

<body bgcolor="#ffffff" text="#000000">

<p align="center"><font size="2" face="Arial"><b>Данные отправлены!</b></font>

</body>

</html>

