import { Config, SortBy, SortOrder } from '../types';

export const saveSettings = (settings: Config) => {
  localStorage.setItem('picturesapp-settings', JSON.stringify(settings));
};

export const getSettings = (): Config => {
  const serializedSettings = localStorage.getItem('picturesapp-settings');
  if (serializedSettings === null) {
    // If no data was found return default values
    return { sortBy: SortBy.Name, sortOrder: SortOrder.Ascending };
  }
  return JSON.parse(serializedSettings) as Config;
};
export const getUserState = (): boolean => {
  const serializedUserState = localStorage.getItem('picturesapp-userState');
  if (serializedUserState === null) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userState = JSON.parse(serializedUserState);
  if (typeof userState !== 'boolean') {
    return false;
  }
  return userState;
};

export const setUserState = (state: boolean): void => {
  localStorage.setItem('picturesapp-userState', JSON.stringify(state));
};
