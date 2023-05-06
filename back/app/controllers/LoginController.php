<?php
require_once __DIR__ . '/../models/LoginModel.php';

/**
 * Clase controladora para la gestión de login.
 */
class LoginController
{
    /**
     * @var LoginModel Modelo para la gestión de login.
     */
    private $loginModel;

    /**
     * Constructor de la clase.
     * Inicializa el modelo de la gestión del login.
     */
    public function __construct()
    {
        $this->loginModel = new LoginModel();
    }

    /**
     * Inicia la sesión de un usuario si las credenciales son válidas.
     * @param array $data Los datos del usuario.
     * @return void Retorna un objeto JSON con la respuesta sobre si el usuario se puede o no autentificar.
     */
    public function login()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'];
        $password = $data['password'];
        $resultado = $this->loginModel->authenticate($username, $password);
        if (!isset($resultado['error'])) {
            $id = $resultado['id'];
            $name = $resultado['nombre'];
            $rol = $resultado['rol'];
            $response = [
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'id' => $id,
                'name' => $name,
                'rol' => $rol,
            ];
            header('Content-Type: application/json');
            echo json_encode($response);
        } else {
            $response = [
                'success' => false,
                'message' => 'Nombre de usuario o contraseña incorrectos',
            ];
            header('Content-Type: application/json');
            http_response_code(401);
            echo json_encode($response);
        }
    }
}
