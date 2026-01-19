import { RADIUS_MAP } from "@/constants";

type HeadlessHeaderProps = {
  logo: string | null;
  radius: keyof typeof RADIUS_MAP;
  primaryColor: string;
  isDark: boolean;
};

export function HeadlessHeader({
  logo,
  radius,
  primaryColor,
  isDark,
}: HeadlessHeaderProps) {
  return (
    <div className="text-center mb-4 flex flex-col items-center gap-2">
      {logo ? (
        <img
          src={logo}
          alt="App logo"
          className="h-16 w-16 object-contain"
          style={{ borderRadius: RADIUS_MAP[radius] }}
        />
      ) : (
        <div
          className="h-16 w-16"
          style={{
            borderRadius: RADIUS_MAP[radius],
            background: `linear-gradient(135deg, ${primaryColor}, ${
              isDark ? "#1a1a2e" : "#ffffff"
            })`,
          }}
        />
      )}
      <h2 className="text-lg font-semibold">Headless Connection</h2>
      <p className="text-sm text-muted-foreground">
        Connect with email, wallet, or <br /> QR code using your own UI
      </p>
    </div>
  );
}
