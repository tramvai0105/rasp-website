declare global {
    namespace App {
        interface Locals {
            isMobile: boolean;
            deviceType: 'mobile' | 'desktop';
        }
        
        interface PageData {
            isMobile?: boolean;
            deviceType?: 'mobile' | 'desktop';
        }
    }
}

export {};