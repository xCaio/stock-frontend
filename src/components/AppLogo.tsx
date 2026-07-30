import logo from "../assets/cabtecMiniLogo.png";

type AppLogoProps = {
  size?: "sm" | "md";
  className?: string;
};

export function AppLogo({ size = "sm", className = "" }: AppLogoProps) {
  return (
    <img
      src={logo}
      alt="Estoque Vallourec"
      className={`app-logo app-logo-${size}${className ? ` ${className}` : ""}`}
    />
  );
}
