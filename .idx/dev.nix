# IDX Development Environment Configuration
{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.nodePackages.pnpm
    pkgs.git
    pkgs.firebase-tools
  ];
  
  env = {
    NODE_ENV = "development";
    PORT = "9002";
  };
  
  idx = {
    extensions = [
      "bradlc.vscode-tailwindcss"
      "ms-vscode.vscode-typescript-next"
      "esbenp.prettier-vscode"
    ];
    
    workspace = {
      onCreate = {
        install-deps = "npm install";
        update-firebase = "npm install -g firebase-tools@latest";
      };
      onStart = {
        dev-server = "npm run dev";
      };
    };
    
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
  };
}