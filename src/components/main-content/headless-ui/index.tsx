import { HeadlessHeader } from "./HeadlessHeader";
import { EmailAuthForm } from "./EmailAuthForm";
import { WalletGrid } from "./WalletGrid";
import { WalletConnectQR } from "./WalletConnectQR";
import type { HeadlessUIProps } from "./types";

export type { HeadlessUIProps };

export function HeadlessUI({
  radius,
  primaryColor,
  isDark,
  logo,
  onWalletConnect,
  onEmailAuthStart,
  onEmailAuthVerify,
}: HeadlessUIProps) {
  return (
    <div className="flex flex-col gap-6">
      <HeadlessHeader
        logo={logo}
        radius={radius}
        primaryColor={primaryColor}
        isDark={isDark}
      />

      <EmailAuthForm
        radius={radius}
        primaryColor={primaryColor}
        isDark={isDark}
        onEmailAuthStart={onEmailAuthStart}
        onEmailAuthVerify={onEmailAuthVerify}
      />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">
          or connect with a wallet
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <WalletGrid radius={radius} onWalletConnect={onWalletConnect} />

      <WalletConnectQR radius={radius} />
    </div>
  );
}
