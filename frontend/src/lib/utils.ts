import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import { FILE_ICONS } from './constants';

//merging class names with clsx
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

//format bytes to human string
export function formatBytes(bytes: number, decimals = 2): string{
    if(bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//Format date to string
export function formatData(date: string | Date): string{
    return format(new Date(date), 'MM/dd/yyyy HH:mm');
}

//Format date to relative time
export function formatRelativeTime(date: string | Date): string{
    return formatDistanceToNow(new Date(date), {addSuffix: true});
}

//Get file icon based on MIME type
export function getFileIcon(mimeType: string): string{
    return FILE_ICONS[mimeType] || FILE_ICONS['default'];
}

//Get file extention from file name
export function getFileExtension(fileName: string): string {
    return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
}

//check if file is an image
export function isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
}

export function isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
}

//Truncate string with ellipsis
export function truncate(str: string, length: number): string{
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

//calculate storage percentage
export function calculateStoragePercentage(used: number, limit: number): number {
    return Math.round((used/limit) * 100);
}

//generate random color for avatars
export function getAvatarColor(name: string): string {
    const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

//Get initials from name
export function getInitials(name: string): string {
    return name
      .split('')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
}

//copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
    try{
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

//Download file from URL
export function downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}