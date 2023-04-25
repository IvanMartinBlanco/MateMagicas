<?php
// Importa el archivo de conexión a la base de datos
require_once __DIR__ . '/../../tools/Connection.php';

/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class WorkManagementModel
{

    public function createUser($userName, $surnames, $age, $email, $emailRepeat, $password, $passwordRepeat, $rol, $idTutor = null, $course = null)
    {
        // Validar que el campo de nombre de usuario no esté vacío
        if (empty($userName)) {
            return ['error' => 'El campo de nombre de usuario es obligatorio'];
        }

        // Validar que el campo de apellidos no esté vacío
        if (empty($surnames)) {
            return ['error' => 'El campo de apellidos es obligatorio'];
        }

        // Validar que el campo de edad no esté vacío y sea un número
        if (empty($age) || !is_numeric($age)) {
            return ['error' => 'El campo de edad es obligatorio y debe ser un número'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if (empty($emailRepeat) || $email !== $emailRepeat) {
            return ['error' => 'El campo de email es obligatorio y debe ser una dirección de email válida'];
        }

        // Validar que los campos de contraseña y confirmación de contraseña no estén vacíos y sean iguales
        if (empty($password)) {
            return ['error' => 'El campo de contraseña es obligatorio'];
        }
        if (empty($passwordRepeat) || $password !== $passwordRepeat) {
            return ['error' => 'Las contraseñas no coinciden'];
        }

        // Validar que el campo de rol no esté vacío y sea uno de los roles permitidos
        $allowedRoles = ['alumno', 'tutor', 'administrador'];
        if (empty($rol) || !in_array($rol, $allowedRoles)) {
            return ['error' => 'El campo de rol es obligatorio y debe ser uno de los siguientes valores: alumno, tutor, administrador'];
        }

        // Validar que el campo de email no esté vacío y sea una dirección de email válida
        if ($rol !== 'alumno') {
            if ($rol === 'tutor' && !empty($idTutor)) {
                return ['error' => 'El tutor no puede elegir un código de tutor.'];
            }
            if ($rol === 'administrador' && (!empty($idTutor) || !empty($course))) {
                return ['error' => 'El administrador no puede elegir un código de tutor ni un curso.'];
            }
        }
        // Conéctate a la base de datos utilizando la función definida en el archivo de conexión
        $conn = connect();

        // Comprobar si el correo electrónico ya está en uso
        $stmt = $conn->prepare("SELECT IdPersona FROM Persona WHERE CorreoElectronico = ?");
        $stmt->bindParam(1, $email);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            // El correo electrónico ya está en uso
            return ['error' => 'El correo electrónico ya está en uso'];
        }

        if($idTutor!=null){
        // Primero, prepara una consulta a la tabla Tutor para verificar si existe un registro con el ID especificado
        $stmt = $conn->prepare("SELECT COUNT(*) FROM Tutor WHERE IdTutor = ?");
        $stmt->bindParam(1, $idTutor);
        $stmt->execute();

        // Luego, obtén el resultado de la consulta y verifica si hay algún registro
        $result = $stmt->fetchColumn();
        if ($result == 0) {
            // Si no hay ningún registro con ese ID, muestra un mensaje de error y detén la ejecución del código
            return ['error' => " El tutor especificado no existe."];
        }
    }

}
