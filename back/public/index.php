<?php
require_once '../app/controllers/LoginController.php';
require_once '../app/controllers/ConstantsController.php';
require_once '../app/controllers/UserManagementController.php';
require_once '../app/controllers/WorkManagementController.php';

// Definir rutas
$login_routes = [
  '/' => ['GET', LoginController::class, 'index'],
  '/login' => ['POST', LoginController::class, 'login'],
];

$constants_routes = [
  '/help' => ['GET', ConstantsController::class, 'help'],
  '/contact' => ['GET', ConstantsController::class, 'contact'],
  '/about' => ['GET', ConstantsController::class, 'about'],
  '/privacy' => ['GET', ConstantsController::class, 'privacy'],
  '/terms' => ['GET', ConstantsController::class, 'terms'],
  '/cookies' => ['GET', ConstantsController::class, 'cookies']
];
$user_management_routes = [
  '/createuser' => ['POST', UserManagementController::class, 'createuser'],
  '/deleteuser' => ['DELETE', UserManagementController::class, 'deleteuser'],
  '/deletestudent' => ['DELETE', UserManagementController::class, 'deleteanotheruser'],
  '/deletetutor' => ['DELETE', UserManagementController::class, 'deleteanotheruser'],
  '/searchstudent' => ['GET', UserManagementController::class, 'searchstudent'],
  '/createstudent' => ['POST', UserManagementController::class, 'createstudent'],
  '/edituser' => ['PUT', UserManagementController::class, 'edituser'],
  '/edittutor' => ['PUT', UserManagementController::class, 'edittutor'],
  '/user' => ['GET', UserManagementController::class, 'getUserById'],
  '/student' => ['GET', UserManagementController::class, 'getStudentByEmail'],
];

$work_management_routes = [
  '/creatework' => ['POST', WorkManagementController::class, 'creatework'],
  '/editablework' => ['GET', WorkManagementController::class, 'getvariable'],
  '/work' => ['GET', WorkManagementController::class, 'getWorksById'],
  '/editvariable' => ['PUT', WorkManagementController::class, 'editvariable'],
  '/deletework' => ['DELETE', WorkManagementController::class, 'deletework'],
  '/getworksbysubject' => ['GET', WorkManagementController::class, 'getworksbysubject'],
];

$routes = array_merge($login_routes, $constants_routes, $user_management_routes, $work_management_routes);

// Enrutamiento
foreach ($routes as $url => $route) {
  $method = $route[0];
  $controller = $route[1];
  $action = $route[2];

  if ($_SERVER['REQUEST_METHOD'] === $method && preg_match('#^/web/back/public'.preg_quote($url,'#').'(\?.*)?$#', $_SERVER['REQUEST_URI'])) {
    $controller = new $controller();
    $params = isset($route[3]) ? $route[3] : [];
    $controller->$action($params);
    break;
  }
}
?>