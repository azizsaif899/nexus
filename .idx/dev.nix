{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.nodePackages.pnpm
    pkgs.git
    pkgs.firebase-tools
  ];
  
  idx = {
    extensions = [
      "ms-vscode.vscode-typescript-next"
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
    ];
    
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        firebase-login = "echo 'Firebase tools ready'";
      };
    };
  };
}