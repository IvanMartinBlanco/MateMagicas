<?php
require_once __DIR__ . '/../models/WorkManagementModel.php';

class WorkManagementController
{
  private $workManagement;

  public function __construct()
  {
    // Inicializa el modelo de inicio y cierre de sesión
    $this->workManagement = new WorkManagementModel();
  }

  public function createWork()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->workManagement->createWork(
      $data['id'],
      $data['workId'],
      $data['stage'],
      $data['subject'],
      $data['name'],
      $data['level']
    );

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Ejercicio creado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al añadir ejercicio: ' . $result['error'];
      } else {
        $mensaje = 'Error al añadir ejercicio: No se ha podido insertar el ejercicio en base de datos.';
      }
      $response = [
        'success' => false,
        'message' => $mensaje
      ];
      header('Content-Type: application/json');
      http_response_code(400);
    }

    echo json_encode($response);
  }

  public function getVariable()
  {
    $userId = $_GET['id'];
    $workId = $_GET['workId'];
    // Realizar la llamada al modelo para obtener los datos del alumno
    $workVariable = $this->workManagement->getVariable(
      $userId,
      $workId
    );

    // Verificar si se produjo un error
    if (isset($workVariable['error'])) {
      // Establecer las cabeceras y código de respuesta para un error
      header('Content-Type: application/json');
      http_response_code(400);

      // Devolver el error como respuesta en formato JSON
      echo json_encode(['error' => $workVariable['error']]);
      return;
    }

    // Convertir el array en un objeto
    $userObj = (object) $workVariable;

    // Establecer las cabeceras y código de respuesta para una respuesta exitosa
    header('Content-Type: application/json');
    http_response_code(200);

    // Devolver los datos del alumno como respuesta en formato JSON
    echo json_encode($userObj);
  }

  public function workById()
  {
    // Obtener el ID del usuario desde los parámetros de la URL
    $workId = $_GET['id'];

    // Realizar la llamada al modelo para obtener los datos del usuario
    $workData = $this->workManagement->getWorkById($workId);

    // Convertir el array en un objeto
    $userObj = (object) $workData;

    // Establecer las cabeceras y código de respuesta
    header('Content-Type: application/json');
    http_response_code(201);

    // Devolver los datos del usuario como respuesta en formato JSON
    echo json_encode($userObj);
  }

  public function editVariable()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $variables = [];
    foreach ($data['data'] as $key => $value) {
      if ($key != 'id') {
        $variables[$key] = $value;
      }
    }
    $workId = $data['id'];

    $result = $this->workManagement->editVariable($variables, $workId);

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Variables modificadas exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al modificar variable: ' . $result['error'];
      } else {
        $mensaje = 'Error al modificar variable: No se ha podido editar la variable en base de datos.';
      }
      $response = [
        'success' => false,
        'message' => $mensaje
      ];
      header('Content-Type: application/json');
      http_response_code(400);
    }

    echo json_encode($response);
  }

  public function deletework()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->workManagement->deleteWork($data['id'], $data['workId']);

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Ejercicio eliminado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(200);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al borrar ejercicio: ' . $result['error'];
      } else {
        $mensaje = 'Error al borrar ejercicio: No se ha podido borrar el ejercicio en base de datos.';
      }
      $response = [
        'success' => false,
        'message' => $mensaje
      ];
      header('Content-Type: application/json');
      http_response_code(400);
    }

    echo json_encode($response);
  }
}
