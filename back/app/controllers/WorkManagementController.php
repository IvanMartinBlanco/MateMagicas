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
          $data['idEjercicio'],
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
}
