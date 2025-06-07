interface ElectronWindow extends Window {
  require?: (module: string) => any;
  process?: {
    type: string;
  };
}

declare let window: ElectronWindow;
