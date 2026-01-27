import Swal from "sweetalert2";

export function showError(text: String) {
    Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: text.toString(),
    });
}