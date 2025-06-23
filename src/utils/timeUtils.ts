export function formatTimeSinceLastOnline(lastOnlineTimestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const secondsSinceLastOnline = now - lastOnlineTimestamp;
    
    const hours = Math.floor(secondsSinceLastOnline / 3600);
    const minutes = Math.floor((secondsSinceLastOnline % 3600) / 60);
    const seconds = secondsSinceLastOnline % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  export function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }