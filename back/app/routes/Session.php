
<?php
// Importar controladores necesarios
require_once '../app/controllers/SessionController.php';

// Definir rutas
$routes = [
  '/session' => ['GET', SessionController::class, 'session'],
];
?>