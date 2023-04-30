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

  public function getNumberVariable()
  {
    $userId = $_GET['id'];
    $workId = $_GET['workId'];
    // Realizar la llamada al modelo para obtener los datos del alumno
    $workVariable = $this->workManagement->getNumberVariable(
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

  public function getVariableValueById()
  {
    // Obtener el ID del usuario desde los parámetros de la URL
    $workId = $_GET['id'];

    // Realizar la llamada al modelo para obtener los datos del usuario
    $workData = $this->workManagement->getVariableValueById($workId);

    // Convertir el array en un objeto
    $userObj = (object) $workData;

    // Establecer las cabeceras y código de respuesta
    header('Content-Type: application/json');
    http_response_code(201);

    // Devolver los datos del usuario como respuesta en formato JSON
    echo json_encode($userObj);
  }

  public function getWorksBySubject()
  {
      // Obtener el ID del usuario desde los parámetros de la URL
      $workStage = $_GET['stage'];
      $workSubject = $_GET['subject'];
      if($workSubject == 'algebralineal'){
        $workSubject='algebra lineal';
      };
  
      // Realizar la llamada al modelo para obtener los datos del usuario
      $workData = $this->workManagement->getWorksBySubject($workStage, $workSubject);
  
      // Crear un array asociativo para almacenar los datos
      $result = [];
  
      // Recorrer el array devuelto por la función getWorksBySubject()
      foreach ($workData as $work) {
          $id = $work['idEjercicio'];
          $name = $work['nombre'];
          $level = $work['nivel'];
  
          // Si el nombre no existe en el array asociativo, agregarlo con un array vacío
          if (!isset($result[$name])) {
              $result[$name] = [];
          }
  
          // Agregar el id del ejercicio y el nivel al array correspondiente al nombre de la asignatura
          $result[$name][] = ['id' => $id, 'level' => $level, 'exerciseId' => $id];
      }
  
      // Establecer las cabeceras y código de respuesta
      header('Content-Type: application/json');
      http_response_code(201);
  
      // Devolver los datos en formato JSON
      echo json_encode($result);
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
