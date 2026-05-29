import appStoreBadge from '../assets/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import googlePlayBadge from '../assets/GetItOnGooglePlay_Badge_Web_color_English.svg';

const APP_STORE_URL = 'https://apps.apple.com/us/app/ultrasync-fitness-tracker/id6749923790';

interface Props {
  className?: string;
  badgeHeight?: string;
}

export default function DownloadBadges({ className = '', badgeHeight = 'h-14' }: Props) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-90 transition-opacity"
      >
        <img src={appStoreBadge} alt="Download on the App Store" className={badgeHeight} />
      </a>
      <img
        src={googlePlayBadge}
        alt="Get it on Google Play — Coming Soon"
        className={`${badgeHeight} opacity-50 cursor-not-allowed`}
        title="Coming soon to Google Play"
      />
    </div>
  );
}
