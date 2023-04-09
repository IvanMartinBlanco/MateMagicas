<?php
// Importa el archivo de conexión a la base de datos
require_once __DIR__ . '/../../tools/Connection.php';
/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class LoginController{

    /**
     * Inicia la sesión de un usuario si las credenciales son válidas.
     *
     * @return void
     */
    public function login()
{
    // Obtiene los datos de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];

    $resultado = $this->authenticate($username, $password);
    // Verifica las credenciales del usuario
    if (!isset($resultado['error'])) {
        // Las credenciales son válidas, crea el token y lo guarda en un archivo
        $token = bin2hex(random_bytes(64)); // Genera un token aleatorio
        $token_data = [
            'user_id' => $resultado['id'], // Donde 'id' es el ID del usuario
            'user_role' => $resultado['rol'], // Donde 'rol' es el rol del usuario
            'exp' => time() + (60 * 60 * 24), // El token expirará en 24 horas
        ];
        file_put_contents(__DIR__ . '/../../api_token.txt', json_encode([$token => $token_data]));
        // Devuelve el token en la respuesta
        $response = [
            'success' => true,
            'token' => $token,
            'message' => 'Inicio de sesión exitoso'
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

    /**
     * Cierra la sesión actual del usuario.
     *
     * @return void
     */
    public function logout()
    {
        session_destroy();

        // Devuelve una respuesta en formato JSON
        $response = [
            'success' => true,
            'message' => 'Cierre de sesión exitoso'
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
    }
    /**
     * Verifica si un nombre de usuario y una contraseña son válidos y devuelve el rol del usuario.
     *
     * Esta función realiza una autenticación de usuario verificando que el nombre de usuario y la contraseña proporcionados correspondan a un usuario registrado en la base de datos. Si la autenticación es exitosa, la función devuelve el rol del usuario y su información de perfil. Si la autenticación falla, se devuelve un mensaje de error y un código de estado HTTP.
     *
     * @param string $username El nombre de usuario a verificar.
     * @param string $password La contraseña a verificar.
     *
     * @return array|false Un arreglo asociativo que contiene la información del usuario si la autenticación es exitosa, o false si la autenticación falla.
     */
    public function authenticate(string $username, string $password)
    {
        // Verifica que los parámetros no estén vacíos
        if (empty($username) || empty($password)) {
            return ['error' => 'Usuario o contraseña vacíos', 'code' => 401];
        }

        // Conéctate a la base de datos utilizando la función definida en el archivo de conexión
        $conn = connect();

        // Define la consulta SQL para buscar en la tabla persona y en qué tabla se encuentra el idpersona
        $sql = "SELECT p.*, CASE 
                WHEN a.IdPersona IS NOT NULL THEN 'Administrador' 
                WHEN t.IdPersona IS NOT NULL THEN 'Tutor' 
                WHEN al.IdPersona IS NOT NULL THEN 'Alumno' 
                ELSE NULL 
            END AS Rol
            FROM Persona p
            LEFT JOIN Administrador a ON a.IdPersona = p.IdPersona
            LEFT JOIN Tutor t ON t.IdPersona = p.IdPersona
            LEFT JOIN Alumno al ON al.IdPersona = p.IdPersona
            WHERE p.CorreoElectronico = :username";

        // Prepara la consulta SQL con parámetros nombrados para evitar SQL injection
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);

        // Ejecuta la consulta
        $stmt->execute();

        // Obtiene el resultado de la consulta
        $result = $stmt->fetch();

        // Si el resultado está vacío, significa que el nombre de usuario o la contraseña son incorrectos
        if (!$result || $result['Password'] !== $password) {
            return ['error' => 'Usuario o contraseña incorrectos', 'code' => 401];
        }

        // Enlaza el rol con el tipo de usuario correspondiente
        switch ($result['Rol']) {
            case 'Administrador':
                $userType = 'administrador';
                break;
            case 'Tutor':
                $userType = 'tutor';
                break;
            case 'Alumno':
                $userType = 'alumno';
                break;
            default:
                return ['error' => 'Tipo de usuario inexistente', 'code' => 401];
        }

        // Devuelve la información del usuario
        return [
            'id' => $result['IdPersona'],
            'nombre' => $result['Nombre'],
            'apellidos' => $result['Apellidos'],
            'email' => $result['CorreoElectronico'],
            'rol' => $userType
        ];
    }
}
