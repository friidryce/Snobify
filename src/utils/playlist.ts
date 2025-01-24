/**
 * Generates a new name for a sub-playlist by appending a version number
 * @param existingNames Array of existing playlist names to check against
 * @param baseName The original playlist name to base the new name on
 * @returns The new playlist name with an appropriate version number
 */
export function generateSubPlaylistName(existingNames: string[], baseName: string): string {
  let version = 2;
  let newName = `${baseName} v${version}`;

  while (existingNames.includes(newName)) {
    version++;
    newName = `${baseName} v${version}`;
  }

  return newName;
} 