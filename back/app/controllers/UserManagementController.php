<?php
require_once __DIR__ . '/../models/UserManagementModel.php';

/**
 * Clase controladora para la gestión de usuarios.
 */
class UserManagementController
{
    /**
     * @var UserManagementModel Modelo para la gestión de usuarios.
     */
    private $userManagement;

    /**
     * Constructor de la clase.
     * Inicializa el modelo de la gestión de usuarios.
     */
    public function __construct()
    {
        $this->userManagement = new UserManagementModel();
    }

    /**
     * Crea un nuevo usuario.
     * @param array $data Los datos del usuario.
     * @return void Retorna un objeto JSON con la respuesta sobre si se ha creado el usuario.
     */
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
                'message' => 'Usuario creado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Elimina un usuario.
     * @param array $data Los datos del usuario a eliminar.
     * @param int $data['id'] El id del usuario que elimina.
     * @param array $data['email'] El email del usuario a eliminar.
     * @return void Retorna un objeto JSON con el resultado de si se ha eliminado o no el usuario.
     */
    public function deleteUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->userManagement->deleteUser($data['id'], $data['email']);
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Usuario eliminado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Elimina otro usuario.
     * @param array $data Los datos del usuario a eliminar.
     * @param int $data['id'] El id del usuario que elimina.
     * @param array $data['email'] El email del usuario a eliminar.
     * @return void Retorna un objeto JSON con el resultado de si se ha eliminado o no el usuario.
     */
    public function deleteAnotherUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->userManagement->deleteAnotherUser($data['id'], $data['email']);
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Usuario eliminado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Edita los datos de un usuario.
     * @param array $data Los datos del usuario a modificar.
     * @return void Retorna un objeto JSON con el resultado de si se ha modificado o no el usuario.
     */
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
                'message' => 'Usuario modificado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Edita los resultados de un ejercicio para un usuario.
     * @param array $data Los datos del resultado a modificar.
     * @return void Retorna un objeto JSON con el resultado de si se ha modificado o no.
     */
    public function editResult()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->userManagement->editResult(
            $data['id'],
            $data['success'],
            $data['idEjercicio']
        );
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'Resultado modificado con éxito',
            ];
            header('Content-Type: application/json');
            http_response_code(201);
        } else {
            if (isset($result['error'])) {
                $mensaje = 'Error al modificar resultado: ' . $result['error'];
            } else {
                $mensaje = 'Error al modificar resultado: No se ha podido editar el resultado en base de datos';
            }
            $response = [
                'success' => false,
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Edita los datos de un tutor.
     * @param array $data Los datos del tutor a modificar.
     * @return void Retorna un objeto JSON con el resultado de si se ha modificado o no el tutor.
     */
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
                'message' => 'Usuario modificado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Obtiene los datos de un usuario por su id.
     * @param int $userId El ID del usuario.
     * @return void Retorna un objeto JSON con los datos del usuario.
     */
    public function getUserById()
    {
        $userId = $_GET['id'];
        $userData = $this->userManagement->getUserById($userId);
        $userObj = (object) $userData;
        header('Content-Type: application/json');
        http_response_code(201);
        echo json_encode($userObj);
    }

    /**
     * Obtiene los datos de un usuario por su email.
     * @param string $email El email del usuario.
     * @return void Retorna un objeto JSON con los datos del usuario.
     */
    public function getStudentByEmail()
    {
        $email = $_GET['email'];
        $userData = $this->userManagement->getStudentByEmail($email);
        if (isset($userData['error'])) {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode(['error' => $userData['error']]);
            return;
        }
        $userObj = (object) $userData;
        header('Content-Type: application/json');
        http_response_code(200);
        echo json_encode($userObj);
    }

    /**
     * Obtiene los datos de un alumno que corresponda a un tutor.
     * @param string $email El email del alumno.
     * @param int $id El ID del tutor.
     * @return void Retorna un objeto JSON con la respuesta sobre si es o no un alumno de este tutor.
     */
    public function searchStudent()
    {
        $email = $_GET['email'];
        $idTutor = $_GET['id'];
        $result = $this->userManagement->searchStudent($email, $idTutor);
        if (isset($result['success']) && $result['success']) {
            $response = [
                'success' => true,
                'message' => 'El correo corresponde a un alumno del tutor.',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }

    /**
     * Crea un nuevo alumno.
     * @param array $data Los datos del alumno.
     * @return void Retorna un objeto JSON con la respuesta sobre si se ha creado el alumno.
     */
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
                'message' => 'Usuario creado con éxito',
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
                'message' => $mensaje,
            ];
            header('Content-Type: application/json');
            http_response_code(400);
        }
        echo json_encode($response);
    }
}