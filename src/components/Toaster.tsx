import {
  ToastContainer,
  Slide,
  type ToastContainerProps,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = ({ theme, ...props }: ToastContainerProps) => {
  return (
    <ToastContainer
      theme={theme}
      autoClose={3000}
      hideProgressBar
      newestOnTop
      pauseOnHover
      closeButton={false}
      transition={Slide}
      toastStyle={{
        backgroundColor: "#1a1a1a",
        border: "1px solid #333",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      {...props}
    />
  );
};

export { Toaster };
