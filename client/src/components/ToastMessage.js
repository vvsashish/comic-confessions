import { Toast } from "react-bootstrap";

export const ToastMessage = ({ show, onClose, message }) => (
  <Toast
    show={show}
    onClose={onClose}
    delay={3000}
    autohide
    bg={
      message === "Awesome!! Your post has been created successfully."
        ? "success"
        : "warning"
    }
    className="toast-message"
  >
    <Toast.Header>
      <strong className="me-auto">
        {message === "Awesome!! Your post has been created successfully."
          ? "Success"
          : "Failed"}
      </strong>
    </Toast.Header>
    <Toast.Body>{message}</Toast.Body>
  </Toast>
);
