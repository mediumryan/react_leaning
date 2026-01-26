// atoms
import { getDefaultStore } from 'jotai';
import { confirmAtom, type ConfirmOptions } from '~/data/confirmData';

const store = getDefaultStore();

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    store.set(confirmAtom, {
      open: true,
      options,
      resolver: resolve,
    });
  });
}
