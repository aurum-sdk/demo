import { useState } from "react";
import { WalletLogo } from "@aurum-sdk/logos/react";
import { WalletId } from "@aurum-sdk/types";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { aurum } from "@/context/AppContext";
import { RADIUS_MAP } from "@/constants";

type WalletConnectQRProps = {
  radius: keyof typeof RADIUS_MAP;
};

export function WalletConnectQR({ radius }: WalletConnectQRProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [wcUri, setWcUri] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const handleWalletConnectQr = async () => {
    setIsLoadingQr(true);
    setShowQrModal(true);
    setWcUri(null);

    try {
      const { uri, waitForConnection } = await aurum.getWalletConnectSession();
      setWcUri(uri);
      setIsLoadingQr(false);

      await waitForConnection();
      const info = await aurum.getUserInfo();
      toast(`User connected with ${info?.walletId}`);
      setShowQrModal(false);
      setWcUri(null);
    } catch (error) {
      toast.error(
        `Error: ${
          (error as { message?: string })?.message ?? "Failed to connect wallet"
        }`
      );
      setShowQrModal(false);
      setWcUri(null);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const closeQrModal = () => {
    setShowQrModal(false);
    setWcUri(null);
  };

  return (
    <>
      {/* WalletConnect QR Button */}
      <button
        onClick={handleWalletConnectQr}
        disabled={isLoadingQr}
        className="flex items-center justify-center gap-3 w-full p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ borderRadius: RADIUS_MAP[radius] }}
      >
        <WalletLogo
          id={WalletId.WalletConnect}
          variant="brand"
          sizeSlot="sm"
          size={24}
          radius={radius}
        />
        <span className="text-sm text-muted-foreground">
          Connect with custom QR Code
        </span>
      </button>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeQrModal}
          />
          <div
            className="relative bg-card border shadow-xl p-6 w-full max-w-sm"
            style={{ borderRadius: RADIUS_MAP[radius] }}
          >
            <button
              onClick={closeQrModal}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex flex-col items-center gap-4">
              <WalletLogo
                id={WalletId.WalletConnect}
                variant="brand"
                sizeSlot="md"
                size={48}
                radius={radius}
              />
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <div className="w-52 h-52 bg-white flex items-center justify-center overflow-hidden">
                {isLoadingQr || !wcUri ? (
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                ) : (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      wcUri
                    )}`}
                    alt="WalletConnect QR Code"
                    className="w-full h-full"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Scan with your mobile wallet to connect
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
