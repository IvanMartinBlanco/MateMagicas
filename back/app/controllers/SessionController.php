
<?php
class SessionController {
  public function session() {
    if(isset($_SESSION['logged_in'])) {
      $response = [
        'logged_in' => $_SESSION['logged_in'],
        'username' => $_SESSION['username'],
        'user_id' => $_SESSION['user_id'],
        'user_role' => $_SESSION['user_role'],
      ];
    } else {
      $response = [
        'logged_in' => false,
        'username' => '',
        'user_id' => '',
        'user_role' => session_id(),
      ];
    }
    header('Content-Type: application/json');
    echo json_encode($response);
  }
}
?>