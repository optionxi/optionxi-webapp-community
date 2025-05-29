import React from "react";

const Alert = ({ type, message }: { type: "success" | "info" | "warning" | "error"; message: string }) => {
  const alertStyles = {
    success: "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800",
    info: "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800",
    warning: "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800",
    error: "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800",
  };

  const iconColors = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  return (
    <div
      role="alert"
      className={`${alertStyles[type]} p-2 rounded-lg flex items-center transition duration-300 ease-in-out transform hover:scale-105`}
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-5 w-5 flex-shrink-0 mr-2 ${iconColors[type]}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
};

// const Alerts = () => {
//   return (
//     <div className="space-y-2 p-4">
//       <Alert type="success" message="Success - Everything went smoothly!" />
//       <Alert type="info" message="Info - This is some information for you." />
//       <Alert type="warning" message="Warning - Be careful with this next step." />
//       <Alert type="error" message="Error - Something went wrong." />
//     </div>
//   );
// };

export default Alert;