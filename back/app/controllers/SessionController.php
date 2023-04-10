
<?php
class SessionController {
  public function setSession(string $id, string $rol) {
    $token = bin2hex(random_bytes(64)); // Genera un token aleatorio
    $token_data = [
        'user_id' => $id, // Donde 'id' es el ID del usuario
        'user_role' => $rol, // Donde 'rol' es el rol del usuario
        'exp' => time() + (60 * 60 * 12), // El token expirará en 24 horas
    ];
    file_put_contents(__DIR__ . '/../../api_token.txt', json_encode([$token => $token_data]));
  }
}
?>