import React from "react";
import classNames from "classnames/bind";
import { Section, BackgroundImage, BackgroundVideo } from "..";
import styles from "./HeroArchive.module.scss";
import DOMPurify from "isomorphic-dompurify";

const cx = classNames.bind(styles);

export default function Hero({
  title,
  className
}) {

  const props = {
    id: 'hero',
    classes: cx("hero", className),
  }

  return (
    <Section props={props}>
      <div className={cx('hero__header', 'col-2-span-12')}>
        {title && (
          <h2 className={cx("hero__title")}>{title}</h2>
        )}
      </div>
    </Section>
  );
}