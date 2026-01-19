import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RADIUS_MAP } from "@/constants";

type EmailAuthFormProps = {
  radius: keyof typeof RADIUS_MAP;
  primaryColor: string;
  isDark: boolean;
  onEmailAuthStart: (email: string) => Promise<string>;
  onEmailAuthVerify: (flowId: string, otp: string) => Promise<void>;
};

export function EmailAuthForm({
  radius,
  primaryColor,
  isDark,
  onEmailAuthStart,
  onEmailAuthVerify,
}: EmailAuthFormProps) {
  const [email, setEmail] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const id = await onEmailAuthStart(email.trim());
      setFlowId(id);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(
        `Error: ${
          (error as { message?: string })?.message ?? "Failed to send OTP"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId || !otp.trim()) return;

    setIsSubmitting(true);
    try {
      await onEmailAuthVerify(flowId, otp.trim());
      toast.success("Connected successfully");
    } catch (error) {
      toast.error(
        `Error: ${
          (error as { message?: string })?.message ?? "Invalid or expired OTP"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        Email Login
      </p>
      {!flowId ? (
        <form onSubmit={handleEmailSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            style={{ borderRadius: RADIUS_MAP[radius] }}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            style={{
              backgroundColor: primaryColor,
              color: isDark ? "#000" : "#fff",
              borderRadius: RADIUS_MAP[radius],
            }}
            className="cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Enter the code sent to <span className="font-medium">{email}</span>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isSubmitting}
              style={{ borderRadius: RADIUS_MAP[radius] }}
              className="flex-1"
              maxLength={6}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !otp.trim()}
              style={{
                backgroundColor: primaryColor,
                color: isDark ? "#000" : "#fff",
                borderRadius: RADIUS_MAP[radius],
              }}
              className="cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              setFlowId(null);
              setOtp("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
          >
            ← Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
