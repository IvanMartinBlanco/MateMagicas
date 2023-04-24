<?php
require_once __DIR__ . '/../models/UserManagementModel.php';

class UserManagementController
{
  private $userManagement;

  public function __construct()
  {
    // Inicializa el modelo de inicio y cierre de sesión
    $this->userManagement = new UserManagementModel();
  }
  public function createUser()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->createUser(
      $data['user-name'],
      $data['surnames'],
      $data['age'],
      $data['email'],
      $data['email-repeat'],
      $data['password'],
      $data['password-repeat'],
      $data['rol'],
      $data['tutor'],
      $data['course']
    );

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario creado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al crear usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al crear usuario: No se ha podido insertar el usuario en base de datos.';
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

  public function deleteUser()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->deleteUser($data['id'], $data['email']);

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario eliminado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(200);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al borrar usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al borrar usuario: No se ha podido borrar el usuario en base de datos.';
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

  public function deleteAnotherUser()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->deleteAnotherUser($data['id'], $data['email']);

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario eliminado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(200);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al borrar usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al borrar usuario: No se ha podido borrar el usuario en base de datos.';
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

  public function editUser()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->editUser(
      $data['id'],
      $data['user-name'],
      $data['surnames'],
      $data['age'],
      $data['email'],
      $data['password'],
      $data['password-repeat'],
      $data['tutor'],
      $data['course']
    );
    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario modificado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al modificar usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al modificar usuario: No se ha podido editar el usuario en base de datos.';
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

  public function editTutor()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->editTutor(
      $data['id'],
      $data['user-name'],
      $data['surnames'],
      $data['age'],
      $data['email'],
      $data['password'],
      $data['password-repeat'],
      $data['tutor'],
      $data['course']
    );
    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario modificado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al modificar usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al modificar usuario: No se ha podido editar el usuario en base de datos.';
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

  public function getUserById()
  {
    // Obtener el ID del usuario desde los parámetros de la URL
    $userId = $_GET['id'];

    // Realizar la llamada al modelo para obtener los datos del usuario
    $userData = $this->userManagement->getUserById($userId);

    // Convertir el array en un objeto
    $userObj = (object) $userData;

    // Establecer las cabeceras y código de respuesta
    header('Content-Type: application/json');
    http_response_code(201);

    // Devolver los datos del usuario como respuesta en formato JSON
    echo json_encode($userObj);
  }

  public function getStudentByEmail()
  {
    // Obtener el ID del usuario desde los parámetros de la URL
    $email = $_GET['email'];

    // Realizar la llamada al modelo para obtener los datos del alumno
    $userData = $this->userManagement->getStudentByEmail($email);

    // Verificar si se produjo un error
    if (isset($userData['error'])) {
      // Establecer las cabeceras y código de respuesta para un error
      header('Content-Type: application/json');
      http_response_code(400);

      // Devolver el error como respuesta en formato JSON
      echo json_encode(['error' => $userData['error']]);
      return;
    }

    // Convertir el array en un objeto
    $userObj = (object) $userData;

    // Establecer las cabeceras y código de respuesta para una respuesta exitosa
    header('Content-Type: application/json');
    http_response_code(200);

    // Devolver los datos del alumno como respuesta en formato JSON
    echo json_encode($userObj);
  }

  public function searchStudent()
  {
    // Obtener el ID del usuario desde los parámetros de la URL
    $email = $_GET['email'];
    // Obtener el ID del usuario desde los parámetros de la URL
    $idTutor = $_GET['id'];

    // Realizar la llamada al modelo para obtener los datos del usuario
    $result = $this->userManagement->searchStudent($email, $idTutor);

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'El correo corresponde a un alumno del tutor.'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al buscar usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al buscar usuario: No se ha podido acceder a la base de datos.';
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

  public function createStudent()
  {
    $data = json_decode(file_get_contents('php://input'), true);

    $result = $this->userManagement->createUser(
      $data['user-name'],
      $data['surnames'],
      $data['age'],
      $data['email'],
      $data['email-repeat'],
      $data['password'],
      $data['password-repeat'],
      "alumno",
      $data['tutor'],
      $data['course']
    );

    if (isset($result['success']) && $result['success']) {
      $response = [
        'success' => true,
        'message' => 'Usuario creado exitosamente'
      ];
      header('Content-Type: application/json');
      http_response_code(201);
    } else {
      if (isset($result['error'])) {
        $mensaje = 'Error al crear usuario: ' . $result['error'];
      } else {
        $mensaje = 'Error al crear usuario: No se ha podido insertar el usuario en base de datos.';
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
