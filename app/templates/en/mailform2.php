
<?php
//  << - stoned animations online mailform.php - >>
// <<< - Stoned Animations online © 2000 - 2001 - >>>


// All you need to change is the e-mail addy:
$email = 'info@kleynodsoft.com';
$subject = 'Message from KleynodSoft site';

$PIB  = nl2br($_POST['PIB']);
$PIB = iconv('UTF-8', 'windows-1251', $PIB);
$Sho = $_POST['Sho'];
    $Sho = iconv('UTF-8', 'windows-1251', $Sho);
$priklad = $_POST['priklad'];
     $priklad = iconv('UTF-8', 'windows-1251', $priklad);
$address = $_POST['address'];

$phone = $_POST['phone'];
$opis  = nl2br($_POST['opis']);
$opis = iconv('UTF-8', 'windows-1251', $opis);


mail($email,$subject,"Data: ПІБ:$PIB, \n Що:$Sho,\n Приклад:$priklad,\n Адрес:$address,\n Телефон:$phone,\n Опис:$opis\n");

?>

<html>

<head>
<title>Sent!</title>
</head>

<body bgcolor="#ffffff" text="#000000">

<p align="center"><font size="2" face="Arial"><b>Данные отправлены!</b></font>

</body>

</html>

