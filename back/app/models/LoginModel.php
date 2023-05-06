<?php
require_once __DIR__ . '/../../tools/Connection.php';
/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class LoginModel
{
    /**
     * Verifica si un nombre de usuario y una contraseña son válidos y devuelve el rol del usuario.
     * Esta función realiza una autenticación de usuario verificando que el nombre de usuario y la contraseña proporcionados correspondan a un usuario registrado en la base de datos. Si la autenticación es exitosa, la función devuelve el rol del usuario y su información de perfil. Si la autenticación falla, se devuelve un mensaje de error y un código de estado HTTP.
     * @param string $username El nombre de usuario a verificar.
     * @param string $password La contraseña a verificar.
     * @return array|false Un arreglo asociativo que contiene la información del usuario si la autenticación es exitosa, o con la clave 'error' y un mensaje de error si ha ocurrido algún problema.
     */
    public function authenticate(string $username, string $password)
    {
        if (empty($username) || empty($password)) {
            return ['error' => 'Usuario o contraseña vacíos', 'code' => 401];
        }
        $conn = connect();
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
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $result = $stmt->fetch();
        if (!$result || $result['Password'] !== $password) {
            return ['error' => 'Usuario o contraseña incorrectos', 'code' => 401];
        }
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
        return [
            'id' => $result['IdPersona'],
            'nombre' => $result['Nombre'],
            'apellidos' => $result['Apellidos'],
            'email' => $result['CorreoElectronico'],
            'rol' => $userType,
        ];
    }
}