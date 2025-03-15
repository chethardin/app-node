import classNames from 'classnames/bind';
import styles from "./Background.module.scss";
import Image from 'next/image';

const cx = classNames.bind(styles);

export default function BackgroundImage({
  img,
  wrapClasses
}) {
  if (!img) return null;

  const {
    sourceUrl,
    altText = "Background image",
    mediaDetails = {},
    sizes,
    imagesTextLegibilityOptions = {}
  } = img;

  const { width, height } = mediaDetails;
  const { bgTint, bgTintColor } = imagesTextLegibilityOptions;
  const bgTintOpacity = Math.abs(bgTint) / 10;

  const renderTint = bgTint !== null && bgTint !== 0;

  return (
    <div className={cx('bg-wrap', wrapClasses)}>
      <Image
        src={sourceUrl}
        alt={altText}
        width={width}
        height={height}
        className="bg bg--cover"
        priority
        sizes={sizes}
      />
      {renderTint && (
        <div
          className="tint"
          style={{
            backgroundColor: bgTintColor || '#0A0A0A',
            opacity: bgTintOpacity,
          }}
        />
      )}
    </div>
  );
}
