{
  pkgs,
  ...
}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_18
    pkgs.nodePackages.firebase-tools
    pkgs.git
  ];
  idx = {
    extensions = [
      "ms-vscode.vscode-typescript-next"
      "bradlc.vscode-tailwindcss"
      "ms-vscode.vscode-json"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
        firebase-login = "firebase login --no-localhost";
      };
      onStart = {
        firebase-emulators = "firebase emulators:start --only dataconnect";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev:web-chatbot"];
          manager = "web";
          env = {
            PORT = "3000";
          };
        };
        api = {
          command = ["npm" "run" "dev:api"];
          manager = "web";
          env = {
            PORT = "3333";
          };
        };
        admin = {
          command = ["npm" "run" "dev:admin-dashboard"];
          manager = "web";
          env = {
            PORT = "4200";
          };
        };
      };
    };
  };
}