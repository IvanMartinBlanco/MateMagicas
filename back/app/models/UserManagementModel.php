<?php
// Importa el archivo de conexión a la base de datos
require_once __DIR__ . '/../../tools/Connection.php';

/**
 * Clase que maneja las operaciones de inicio y cierre de sesión de usuarios en el sistema.
 */
class UserManagementModel
{

    public function createUser($userName, $surnames, $age, $email, $emailRepeat, $password, $passwordRepeat, $rol, $tutor = null, $course = null)
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
            if ($rol !== 'tutor' && !empty($tutor)) {
                return ['error' => 'El tutor no puede elegir un código de tutor.'];
            }
            if ($rol !== 'administrador' && !empty($tutor) || !empty($course)) {
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
        // Insertar el nuevo usuario en la tabla Persona
        $stmt = $conn->prepare("INSERT INTO Persona (Nombre, Apellidos, Edad, CorreoElectronico, `Password`) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $userName);
        $stmt->bindParam(2, $surnames);
        $stmt->bindParam(3, $age);
        $stmt->bindParam(4, $email);
        $stmt->bindParam(5, $password);
        $stmt->execute();
        // Obtener el IdPersona del usuario recién insertado
        $idPersona = $conn->lastInsertId();
        // Insertar el nuevo usuario en la tabla correspondiente
        if ($rol == 'alumno') {
            $stmt = $conn->prepare("INSERT INTO Alumno (Curso, IdTutor, IdPersona) VALUES (?, ?, ?)");
            $stmt->bindParam(1, $course);
            $stmt->bindParam(2, $idTutor);
            $stmt->bindParam(3, $idPersona);
            $stmt->execute();
        } elseif ($rol == 'tutor') {
            $stmt = $conn->prepare("INSERT INTO Tutor (Curso, IdPersona) VALUES (?, ?)");
            $stmt->bindParam(1, $course);
            $stmt->bindParam(2, $idPersona);
            $stmt->execute();
        } elseif ($rol == 'administrador') {
            $stmt = $conn->prepare("INSERT INTO Administrador (IdPersona) VALUES (?)");
            $stmt->bindParam(1, $idPersona);
            $stmt->execute();
        }
        // Devolver el resultado de la operación
        $result =  $stmt->rowCount() > 0 ? true : false;
        return ['success' => $result];
    }

    public function deleteUser($idPersona, $email) {
        // Validar que el campo de idPersona no esté vacío
        if (empty($idPersona)) {
            return ['error' => 'El id es obligatorio'];
        }
        if (empty($email)) {
            return ['error' => 'El email es obligatorio'];
        }
        // Conectar a la base de datos
        $conn = connect();
    
        // Verificar si el usuario es un alumno
        $stmt = $conn->prepare("SELECT IdAlumno FROM Alumno WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            // El usuario no es un alumno
            return ['error' => 'El usuario no es un alumno'];
        }
    
        // Verificar que el correo electrónico es correcto
        $stmt = $conn->prepare("SELECT CorreoElectronico FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
        $row = $stmt->fetch();
        if ($row['CorreoElectronico'] != $email) {
            // El correo electrónico no es correcto
            return ['error' => 'El correo electrónico no es el del usuario'];
        }
        
        // Eliminar el usuario
        $stmt = $conn->prepare("DELETE FROM Persona WHERE IdPersona = ?");
        $stmt->bindParam(1, $idPersona);
        $stmt->execute();
    
        // Verificar si se ha eliminado el registro en la tabla Persona
        if ($stmt->rowCount() > 0) {
            // El usuario se ha eliminado correctamente
            return ['success' => true];
        } else {
            // No se ha eliminado ningún registro
            return ['error' => 'No se ha podido eliminar el usuario'];
        }
    }
}
