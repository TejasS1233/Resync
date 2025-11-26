import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

const GuestBanner = ({ onSignUp }) => {
  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <AlertCircle className="h-5 w-5 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-yellow-800 dark:text-yellow-200">
          <strong>Guest Mode:</strong> Your data is stored locally and will be cleared when you
          clear your browser cache. Sign up to save your progress permanently.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onSignUp}
          className="ml-4 border-yellow-600 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900"
        >
          Sign Up
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GuestBanner;
