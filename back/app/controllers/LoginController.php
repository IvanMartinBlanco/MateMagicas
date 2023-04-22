<?php
// Importa el archivo del modelo de inicio y cierre de sesión
require_once __DIR__ . '/../models/LoginModel.php';

/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class LoginController {
    private $loginModel;

    public function __construct() {
        // Inicializa el modelo de inicio y cierre de sesión
        $this->loginModel = new LoginModel();
    }

    /**
     * Inicia la sesión de un usuario si las credenciales son válidas.
     *
     * @return void
     */
    public function login() {
        // Obtiene los datos de la solicitud
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'];
        $password = $data['password'];

        $resultado = $this->loginModel->authenticate($username, $password);

        // Verifica las credenciales del usuario
        if (!isset($resultado['error'])) {
            // Obtiene los datos del usuario
            $id = $resultado['id'];
            $name = $resultado['nombre'];
            $rol = $resultado['rol'];

            // Crea el arreglo de respuesta
            $response = [
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'id' => $id,
                'name' => $name,
                'rol' => $rol
            ];

            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            // Las credenciales no son válidas, devuelve un error
            $response = [
                'success' => false,
                'message' => 'Nombre de usuario o contraseña incorrectos'
            ];
            header('Content-Type: application/json');
            http_response_code(401);
            echo json_encode($response);
        }
    }

}

