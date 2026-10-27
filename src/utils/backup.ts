import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const BACKUP_FILENAME = '.improvtodo_backup.json';

export interface AppBackupData {
  todos: any[];
  notes: any[];
  customPrompts: any[];
  appSettings: any;
  goals?: any[];
  goalStats?: any;
}

/**
 * Silently saves the entire app state to the persistent Documents folder.
 * This file survives app uninstalls.
 */
export const autoBackup = async (data: AppBackupData) => {
  try {
    const payload = JSON.stringify(data);
    await Filesystem.writeFile({
      path: BACKUP_FILENAME,
      data: payload,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  } catch (error) {
    console.error('AutoBackup failed (likely permissions or platform issue):', error);
  }
};

/**
 * Checks if a backup file exists in the persistent Documents folder.
 * If found, returns the parsed JSON data, otherwise returns null.
 */
export const checkForBackup = async (): Promise<AppBackupData | null> => {
  try {
    const contents = await Filesystem.readFile({
      path: BACKUP_FILENAME,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    
    if (contents && contents.data) {
      // In capacitor 6+, contents.data is string if encoding is UTF8
      const rawData = typeof contents.data === 'string' ? contents.data : (contents as any).data;
      return JSON.parse(rawData) as AppBackupData;
    }
  } catch (error) {
    // File likely doesn't exist, this is expected on first install with no backup
    console.log('No backup found or cannot read backup.');
  }
  return null;
};
