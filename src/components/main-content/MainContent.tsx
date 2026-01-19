import { Loader2 } from "lucide-react";
import { ConnectWidget } from "@aurum-sdk/core/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { useApp, aurum } from "@/context/AppContext";
import { RADIUS_MAP, FONT_OPTIONS } from "@/constants";
import { PreviewHeader } from "./PreviewHeader";
import { DisconnectedState } from "./DisconnectedState";
import { ConnectedState } from "./ConnectedState";
import { HeadlessUI } from "./headless-ui";

export function MainContent() {
  const {
    isDark,
    radius,
    fontIndex,
    primaryColor,
    logo,
    connectUxMode,
    isLoading,
    userInfo,
    isSigning,
    handleConnect,
    handleDisconnect,
    handleSign,
    handleShare,
    handleWidgetConnect,
    handleHeadlessConnect,
    handleEmailAuthStart,
    handleEmailAuthVerify,
  } = useApp();

  return (
    <main className="flex-1 flex flex-col">
      <PreviewHeader connectUxMode={connectUxMode} onShare={handleShare} />

      {/* Main content area - centered with padding */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 pb-4 sm:pb-8">
        {isLoading ? (
          <div className="w-full max-w-md flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : connectUxMode === "widget" && !userInfo ? (
          <ConnectWidget aurum={aurum as any} onConnect={handleWidgetConnect} />
        ) : connectUxMode === "headless" && !userInfo ? (
          <Card
            className="w-full max-w-md"
            style={{
              borderRadius: RADIUS_MAP[radius],
              fontFamily: FONT_OPTIONS[fontIndex]?.value,
            }}
          >
            <CardContent className="p-4 sm:p-6">
              <HeadlessUI
                radius={radius}
                primaryColor={primaryColor}
                isDark={isDark}
                logo={logo}
                onWalletConnect={handleHeadlessConnect}
                onEmailAuthStart={handleEmailAuthStart}
                onEmailAuthVerify={handleEmailAuthVerify}
              />
            </CardContent>
          </Card>
        ) : (
          <Card
            className="w-full max-w-md"
            style={{
              borderRadius: RADIUS_MAP[radius],
              fontFamily: FONT_OPTIONS[fontIndex]?.value,
            }}
          >
            <CardContent className="p-4 sm:p-6">
              {!userInfo ? (
                <DisconnectedState
                  logo={logo}
                  radius={radius}
                  primaryColor={primaryColor}
                  isDark={isDark}
                  onConnect={handleConnect}
                />
              ) : (
                <ConnectedState
                  userInfo={userInfo}
                  radius={radius}
                  primaryColor={primaryColor}
                  isDark={isDark}
                  isSigning={isSigning}
                  onSign={handleSign}
                  onDisconnect={handleDisconnect}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
