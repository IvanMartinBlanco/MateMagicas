
<?php
require_once '../app/controllers/LoginController.php';
require_once '../app/controllers/SessionController.php';
// Definir rutas
$login_routes = [
  '/' => ['GET', LoginController::class, 'index'],
  '/login' => ['POST', LoginController::class, 'login'],
  '/logout' => ['GET', LoginController::class, 'logout']
];

$session_routes = [
  '/session' => ['GET', SessionController::class, 'session']
];

$routes = array_merge($login_routes, $session_routes);

// Enrutamiento
foreach ($routes as $url => $route) {
  $method = $route[0];
  $controller = $route[1];
  $action = $route[2];

  if ($_SERVER['REQUEST_METHOD'] === $method && preg_match('#^/web/back/public'.$url.'$#', $_SERVER['REQUEST_URI'])) {
    $controller = new $controller();
    $controller->$action();
    break;
  }
}
?>