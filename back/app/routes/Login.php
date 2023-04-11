
<?php
// Importar controladores necesarios
require_once '../app/controllers/LoginController.php';
// Definir rutas
$routes = [
  '/login' => ['POST', LoginController::class, 'login'],
  '/logout' => ['POST', LoginController::class, 'logout']
];
?>