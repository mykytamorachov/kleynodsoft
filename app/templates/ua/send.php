<?php
//  << - stoned animations online mailform.php - >>
// <<< - Stoned Animations online © 2000 - 2001 - >>>


// All you need to change is the e-mail addy:
$email = 'info@kleynodsoft.com';
$subject = 'Message from KleynodSoft site-Contact';

$Name = $_POST['Name'] . ' ' . $_POST['email'] . ' ' . $_POST['pfone'] . ' ' . $_POST['message'];
   $Name = iconv('UTF-8', 'windows-1251', $Name);


mail($email,$subject,"Data:$Name");

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sent!</title>
</head>

<body bgcolor="#ffffff" text="#000000">

<p align="center"><font size="2" face="Arial"><b>Повідомлення відправлено!</b></font>

</body>

</html>

